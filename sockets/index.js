const moment = require('moment');
const controller = require('../controllers/chatController');

const connectedUsers = [];

// baseado no código de Luciano Lodi
module.exports = (io) => io.on('connection', async (socket) => {
  const chatHistory = await controller.getAll().then((chat) =>
    chat.map(({ time, nick, msg }) => socket.emit('message', `${time} - ${nick}: ${msg}`)));

  socket.emit('newConnection', chatHistory);
  connectedUsers[socket.id] = socket.id.substring(0, 16);
  io.emit('onlineUsersUpdate', Object.values(connectedUsers));

  socket.on('disconnect', () => {
    delete connectedUsers[socket.id];
    io.emit('onlineUsersUpdate', Object.values(connectedUsers));
  });

  socket.on('message', ({ chatMessage, nick }) => {
    const newMessage = `${moment().format('DD-MM-yyyy HH:mm:ss')} - ${nick}: ${chatMessage}`;
    io.emit('message', newMessage);
    controller.saveMessage(chatMessage, nick, moment().format('DD-MM-yyyy HH:mm:ss'));
  });

  socket.on('nickname', (user) => {
    connectedUsers[socket.id] = user;
    io.emit('onlineUsersUpdate', Object.values(connectedUsers)); 
  });
});