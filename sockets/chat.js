module.exports = (io) => io.on('connection', (socket) => {
  socket.emit('serverMessage', 'Bem vindo ao nosso Chat Público');
  socket.on('clientMessage', (message) => {
    io.emit('serverMessage', `${socket.id}: ${message}`);
  });
});