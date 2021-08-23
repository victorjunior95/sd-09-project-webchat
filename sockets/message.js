const moment = require('moment');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', async ({ chatMessage, nickname }) => {
      const time = moment().format('D-MM-YYYY - h:mm:ss a');
      const messageToRender = `${time} - ${nickname}: ${chatMessage}`;

      io.emit('message', messageToRender);
    });
  });
};
