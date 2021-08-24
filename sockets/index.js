const moment = require('moment');
const chatController = require('../controllers/chatController');

module.exports = (io) => io.on('connection', async (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const newMessage = `${moment().format('DD-MM-yyyy HH:mm:ss A')} - ${nickname}: ${chatMessage}`;
    io.emit('message', newMessage);
    chatController.saveMessage(chatMessage, nickname, moment().format('DD-MM-yyyy HH:mm:ss A'));
  });
});