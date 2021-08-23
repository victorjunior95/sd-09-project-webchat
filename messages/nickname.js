const Users = require('../controllers/users');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('newNickname', async ({ oldNickname, newNickname }) => {
      await Users.updateNickname({ oldNickname, newNickname });
      io.emit('newNickname', { oldNickname, newNickname });
    });
  });
};
