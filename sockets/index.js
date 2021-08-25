const moment = require('moment');
const controller = require('../controllers/chatController');

const users = {};

// baseado no código de Luciano Lodi
module.exports = (io) => io.on('connection', async (socket) => {
  const chatHistory = await controller.getAll().then((chat) => chat
    .map(({ time, nickname, message }) => 
      `${time} - ${nickname}: ${message}`));

  socket.emit('newConnection', chatHistory);
  users[socket.id] = socket.id.substring(0, 16);
  io.emit('upd', Object.values(users));

  socket.on('disconnect', () => { delete users[socket.id]; io.emit('upd', Object.values(users)); });

  socket.on('message', ({ chatMessage, nickname }) => {
    const newMessage = `${moment().format('DD-MM-yyyy HH:mm:ss A')} - ${nickname}: ${chatMessage}`;
    io.emit('message', newMessage);
    controller.saveMessage(chatMessage, nickname, moment().format('DD-MM-yyyy HH:mm:ss A'));
  });

  socket.on('nickname', (user) => {
    users[socket.id] = user;
    io.emit('upd', Object.values(users)); 
  });
});