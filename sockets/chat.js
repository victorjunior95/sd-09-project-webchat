const moment = require('moment');

const messageTime = moment().format('DD-MM-YYYY HH:mm:ss');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.emit('welcome', `welcome ${socket.id} to the TrybeChat`);

    socket.on('message', (message) => {
      io.emit('message', `${messageTime} ${socket.id} diz: ${message}`);
    });

    socket.broadcast.emit('online', `${socket.id} está online`);
  });
};