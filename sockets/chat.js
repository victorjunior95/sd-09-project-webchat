const moment = require('moment');

const messageTime = moment().format('DD-MM-YYYY HH:mm:ss');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.emit('welcome', `welcome ${socket.id} to the TrybeChat`);

    socket.on('message', ({ chatMessage, nickname }) => {
      io.emit('message', `${messageTime} ${nickname} diz: ${chatMessage}`);
    });

    socket.broadcast.emit('online', `${socket.id} está online`);
  });
};