const chatModel = require('../models/chatModels');

// let users = [];
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

    /* const currentNickname = users[socket.id];

    if (!currentNickname) { users[socket.id] = nickname; } */

    console.log(`[id] > ${socket.id}, nickname: ${nickname}`);

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
  });
};

const socketServer = (io) => io.on('connection', (socket) => {
  /* const xablau = io.of('/').sockets;
  
  console.log('========= conectados ==========');
  xablau.forEach((element) => {
    console.log('[id]', element.id);
  }); */
  handleMessages(socket, io);
  handleUsers(socket, io);
  handleDisconnect(socket);
});

module.exports = socketServer;
