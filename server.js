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
const Middlewares = require('./middlewares');

const users = [];
const { PORT } = process.env;

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

io.on('connection', (socket) => {
  socket.on('newUser', (nickname) => {
    users.push({
      userId: socket.id,
      nickname,
    });
    socket.broadcast.emit('newUser', nickname);
  });

  socket.on('onlineUsers', () => io.emit('onlineUsers', users));

  socket.on('message', ({ chatMessage, nickname }) => {
    editedMessage(chatMessage, nickname);
  });
});

app.use(Middlewares.error);

http.listen(PORT, () => {
  console.clear();
  console.log(`Ouvindo na porta ${PORT}`);
});
