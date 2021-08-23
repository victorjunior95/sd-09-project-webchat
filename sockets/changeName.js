const userModel = require('../models/userRequests');

module.exports = (io) => {
  io.on('connection', (socket) => {
    const nick = socket.id.slice(0, 16);
    socket.on('clientNickname', async (nickname) => {
      const userUpdated = { socketId: nick, nickname };
      await userModel.updateNickname(nick, nickname);
      const newUsers = await userModel.getUsers();
      io.emit('updateListOfUsers', newUsers);
      socket.emit('setUser', userUpdated);
    });
  });
};
