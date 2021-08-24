module.exports = (io) => {
  io.on('connection', (socket) => {
    const nick = socket.id.slice(0, 16);
    socket.on('clientNickname', async ({ newNick, users }) => {
      const userUpdated = { socketId: nick, nickname: newNick };
      users.forEach((item) => {
        console.log(item);
        if (item.socketId === nick) {
          const user = item;
          user.nickname = newNick;
        }
      });

      io.emit('updateListOfUsers', users);
      socket.emit('updateUser', userUpdated);
    });
  });
};
