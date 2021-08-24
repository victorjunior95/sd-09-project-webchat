module.exports = (io) => {
  io.on('connection', async (socket) => {
    const nick = socket.id.slice(0, 16);
    const user = { socketId: nick, nickname: nick };
    socket.emit('setUser', user);

    socket.on('login', (users) => {
      io.emit('login', users);
      socket.emit('loginClient', { userToSend: users, user });
    });

    socket.on('updateUsers', (users) => {
      io.emit('updateListOfUsers', users);
    });

    socket.on('disconnect', async () => {
      io.emit('disconnectMe', user);
    });
  });
};
