const moment = require('moment');
const controller = require('../controllers/chatController');

const connectedUsers = [];

// baseado no código de Luciano Lodi
module.exports = (io) => io.on('connection', async (socket) => {
  const chatHistory = await controller.getAll().then((chat) =>
    chat.map(({ time, nickname, messages }) => socket.emit('message', `${time} - ${nickname}: ${messages}`)));
  
    console.log(`connected ${socket.id}`);
  socket.emit('newConnection', chatHistory);
  connectedUsers[socket.id] = socket.id.substring(0, 16);
  io.emit('onlineUsersUpdate', Object.values(connectedUsers));

  socket.on('disconnect', () => {
    delete connectedUsers[socket.id];
    io.emit('onlineUsersUpdate', Object.values(connectedUsers));
    console.log(`disconn ${socket.id}`);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const newMessage = `${moment().format('DD-MM-yyyy HH:mm:ss')} - ${nickname}: ${chatMessage}`;
    io.emit('message', newMessage);
    controller.saveMessage(chatMessage, nickname, moment().format('DD-MM-yyyy HH:mm:ss'));
  });

  socket.on('nickname', (user) => {
    connectedUsers[socket.id] = user;
    io.emit('onlineUsersUpdate', Object.values(connectedUsers)); 
  });
});