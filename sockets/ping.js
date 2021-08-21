module.exports = (io) => io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id} `);

  socket.emit('myId', socket.id);

  socket.on('ping', () => {
    console.log(`${socket.id} emitiu um ping!`);
  });

  socket.on('sendMessage', (data) => {
    const { messageUserId, message } = data;
    io.emit('newMessage', { messageUserId, message });
  });
});