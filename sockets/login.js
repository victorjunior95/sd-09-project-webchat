const userModel = require('../models/userRequests');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const nick = socket.id.slice(0, 16);
    const user = { socketId: nick, nickname: nick };
    socket.emit('setUser', user);

    await userModel.insertUser(user);

    const userToSend = await userModel.getUsers();
    io.emit('login', userToSend);
    
    socket.emit('loginClient', { userToSend, user });

    socket.on('disconnect', async () => {
      await userModel.deleteUser(nick);
      const users = await userModel.getUsers();
      socket.broadcast.emit('updateListOfUsers', users);
    });
  });
};
