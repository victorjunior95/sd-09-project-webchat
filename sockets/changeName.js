const userModel = require('../models/userRequests');

module.exports = (io) => {
  io.on('connection', (socket) => {
    const nick = socket.id.slice(0, 16);
    socket.on('clientNickname', async ({ newNick, users }) => {
      const userUpdated = { socketId: nick, nickname: newNick };
      users.forEach((item) => {
        console.log(item);
        if (item.socketId === nick) {
          item.nickname = newNick
        }
      });
      console.log(nick, users);

      // await userModel.updateNickname(nick, nickname);
      // const newUsers = await userModel.getUsers();
      io.emit('updateListOfUsers', users);
      socket.emit('updateUser', userUpdated);
    });
  });
};
