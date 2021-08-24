const nicknames = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    const stranger = `Stranger-${socket.id.slice(0, 7)}`;
    nicknames[socket.id] = stranger;

    socket.emit('nickname', stranger);

    io.emit('onlineCheck');

    socket.on('nicknameChange', ({ nickname, oldNickname }) => {
      socket.emit('nicknameChange', nickname);
      socket.broadcast.emit('otherUserNicknameChange', oldNickname, nickname);
      nicknames[socket.id] = nickname;
    });

    socket.on('onlineUser', ({ nickname }) => {
      io.emit('onlineUser', nickname);
    });

    socket.on('disconnect', () => {
      io.emit('offlineUser', nicknames[socket.id]);
      nicknames.splice(socket.id, 1);
    });
  });
};
