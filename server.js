// Faça seu código aqui
require('dotenv').config();
const express = require('express');
const path = require('path');
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const Models = require('./models');

let users = [];
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'views')));

const editedMessage = (chatMessage, nickname) => {
  const timestampMessage = moment(Date.now())
    .format('DD-MM-yyyy HH:mm:ss');
  Models.createMessage({
    message: chatMessage,
    nickname,
    timestamp: timestampMessage,
  });
  io.emit('message', `${timestampMessage} - ${nickname}: ${chatMessage}`);
};

const disconnectUser = (client) => {
  users = client;
  io.emit('onlineUsers', users);
  io.emit('disconnectUser');
};

io.on('connection', (socket) => {
  socket.on('newUser', (nickname) => {
    users.push({ userId: socket.id, nickname });
    socket.broadcast.emit('newUser', nickname);
  });

  socket.on('onlineUsers', () => io.emit('onlineUsers', users));

  socket.on('message', ({ chatMessage, nickname }) => {
    editedMessage(chatMessage, nickname);
  });

  socket.on('updateUser', (nickname) => {
    const userIndex = users.findIndex((user) => user.userId === socket.id);
    users[userIndex].nickname = nickname;
    io.emit('onlineUsers', users);
  });

  socket.on('disconnect', () => {
    const allClients = users.filter((user) => user.userId !== socket.id);
    disconnectUser(allClients);
  });
});

app.get('/', async (_request, response) => {
  const messages = await Models.getAllMessage();
  response.render('index', { messages });
});

http.listen(PORT, () => {
  console.clear();
  console.log(`Ouvindo na porta ${PORT}`);
});
