const userModel = require('../models/userRequests');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const nick = socket.id.slice(0, 16);
    const user = { socketId: nick, nickname: nick };
    const usersFromDB = await userModel.getUsers();

    if (usersFromDB.length === 0) {
      await userModel.createUser(user);
    } else {
      await userModel.insertUser(user);
    }

    const userToSend = await userModel.getUsers();

    io.emit('login', userToSend);

    socket.emit('setUser', user);

    socket.on('disconnect', async () => {
      await userModel.deleteUser(nick);
      const users = await userModel.getUsers();
      socket.broadcast.emit('updateListOfUsers', users);
    });
  });
};
