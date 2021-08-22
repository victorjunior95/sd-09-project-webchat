require('dotenv').config();
const express = require('express');

const app = express();
const path = require('path');
const bodyParser = require('body-parser').json();

const PORT = 3000;

const socketServer = require('http').createServer(app);
const io = require('socket.io')(socketServer);

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
const messages = [];

// o que faz quando um novo client se conecta, é conectado ao socket.io no front
io.on('connection', (socket) => {
  const socketId = socket.id;
  console.log(`Client ${socketId} se conectou`);

  socket.emit('previousMessages', messages);

  const randomId = socketId.slice(0, 16);
  socket.emit('randomId', randomId);

  socket.on('message', ({ nickname, chatMessage }) => {
    const message = `${messageDate()} - ${nickname}: ${chatMessage}`;
    messages.push(message);
    io.emit('sentMessages', message);
    return message;
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} se desconectou`);
  });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static('public'));

app.use('/', (_req, res) => res.render('index.ejs'));

app.use(bodyParser);

socketServer.listen(PORT, () => console.log(`Socket na ${PORT}`));