const formatMessage = require('../utils/formatMessage');

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', formatMessage(chatMessage, nickname));
  });
});