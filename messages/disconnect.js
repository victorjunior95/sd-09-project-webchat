const { deleteOne } = require('../controllers/users');
const users = require('../models/usersObject');

module.exports = async (io) => {
  io.on('connection', async (socket) => {
    socket.on('disconnecting', () => {
      const { nickname } = users[socket.id];
      delete users[socket.id];
      deleteOne(socket.id);
      io.emit('logoff', nickname);
    });
  });
};
