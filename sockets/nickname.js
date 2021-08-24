module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.emit('nickname', `Stranger-${socket.id.slice(0, 7)}`);

    io.emit('onlineCheck');

    socket.on('nicknameChange', ({ nickname, oldNickname }) => {
      socket.emit('nicknameChange', nickname);
      socket.broadcast.emit('otherUserNicknameChange', oldNickname, nickname);
    });

    socket.on('onlineUser', ({ nickname }) => {
      io.emit('onlineUser', nickname);
    });

    socket.on('end', ({ nickname }) => {
      io.emit('offlineUser', nickname);
    });
  });
};
