const chatModel = require('../models/chatModels');

const users = {};

const formatDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return `${day}-${month}-${year} ${hour}:${min}:${sec}`;
};

const handleMessages = (socket, io) => {
  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;

    const date = formatDate();
    const formatMessage = `${date} - ${nickname}: ${chatMessage}`;

    chatModel.createMessage(chatMessage, nickname, date);

    io.emit('message', formatMessage);
  });
};

const handleUsers = (socket, io) => {
  socket.on('users', (nickname) => {
    users[socket.id] = nickname;
    console.log('[users] > ', users);
    io.emit('users', users);
  });
};

const handleDisconnect = (socket) => {
  socket.on('disconnect', () => {
    console.log(`[${socket.id}] desconectou-se`);
    delete users[socket.id];
    console.log('[users] > ', users);
    // envia para todos os clientes exceto que se desconectou
    socket.broadcast.emit('users', users);
  });
};

const socketServer = (io) => io.on('connection', (socket) => {
  handleMessages(socket, io);
  handleUsers(socket, io);
  handleDisconnect(socket);
});

module.exports = socketServer;
