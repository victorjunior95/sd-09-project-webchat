require('dotenv').config();
const express = require('express');

const app = express();
const path = require('path');
const bodyParser = require('body-parser').json();

const PORT = 3000;

const socketServer = require('http').createServer(app);
const io = require('socket.io')(socketServer);
const { postMessages, getMessages } = require('./models/messages');

const messageDate = () => {
  const toLocale = new Date()
  .toLocaleDateString('pt-br', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const date = toLocale.split('/').join('-');
  const hour = new Date().toTimeString().split(' ')[0];
  return `${date} ${hour}`;
};

let users = [];

const sendMessage = async ({ nickname, chatMessage }) => {
  const timestamp = messageDate();
  const message = `${timestamp} - ${nickname}: ${chatMessage}`;
  await postMessages({
    message: chatMessage,
    nickname,
    timestamp,
  });
  io.emit('message', message);
  return message;
};


// o que faz quando um novo client se conecta, é conectado ao socket.io no front
io.on('connection', (socket) => {
  // socket.emit('previousMessages', await previousMessages());

  const id = socket.id.slice(0, 16);
  socket.emit('onlineUser', id);
  socket.on('userObject', (user) => {
    users.push(user);
    io.emit('onlineUsers', users);
  });

  socket.on('customNickname', (data) => {
    const found = users.find((item) => item.id === id);
    found.nickname = data.nickname;
    io.emit('onlineUsers', users);
  });
  
  socket.on('message', sendMessage);

  socket.on('disconnect', () => {
    const filtered = users.filter((item) => item.id !== id);
    users = filtered;
    io.emit('onlineUsers', users);
  });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static('public'));

app.use('/', async (_req, res) => {
  const previousMessages = await getMessages();
  res.render('index.ejs', { previousMessages });
});

app.use(bodyParser);

socketServer.listen(PORT, () => console.log(`Socket na ${PORT}`));