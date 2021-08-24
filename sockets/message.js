const model = require('../models/chat');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', ({ chatMessage, nickname }) => {
      const time = new Date();

      const timeDate = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`;
      const timeHour = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      const timestamp = `${timeDate} ${timeHour}`;

      const message = `${timestamp} - ${nickname}: ${chatMessage}`;

      model.postMessage({ timestamp, nickname, message: chatMessage });

      io.emit('message', message);
    });
  });
};
