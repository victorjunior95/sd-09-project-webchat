const { deleteOne, clearUsers } = require('../controllers/users');
const { clearMessages } = require('../controllers/messages');

module.exports = async (io) => {
  io.on('connection', async (socket) => {
    socket.on('disconnecting', (reason) => {
      console.log('disconnecting... ');
      console.log('reason: ', reason);
      deleteOne(socket.id);
    });
  });
  io.on('disconnect', async () => {
    clearUsers();
    clearMessages();
  });
};
