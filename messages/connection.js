const users = require('../models/usersObject');
const Users = require('../controllers/users');

module.exports = (io) => {
  io.on('connection', (socket) => {
    const newUser = socket.id.split('', 16).join('');
    users[socket.id] = { nickname: newUser };

    socket.on('newUser', async () => {
      io.emit('connected', { newUser });
      socket.emit('newUser', { newUser });
      Users.insertOne({ nickname: newUser, id: socket.id });
    });

    socket.on('connected', async (localNickname) => {
      io.emit('connected', { newUser: localNickname });
      users[socket.id] = { nickname: localNickname };
      const userExists = await Users.findByNickname(localNickname);

      if (!userExists) {
        Users.insertOne({ nickname: localNickname, id: socket.id });
      }
    });
});
};
