module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.emit('nickname', `Stranger-${socket.id.slice(0, 7)}`);

    socket.on('nicknameChange', ({ nickname }) => {
      socket.emit('nicknameChange', nickname);
    });
  });
};
