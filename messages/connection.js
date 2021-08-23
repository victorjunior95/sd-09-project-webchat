module.exports = (io, Users) => {
  io.on('connection', (socket) => {
    socket.on('newUser', async (nickname) => {
      io.emit('connected', { newUser: nickname });
      Users.insertOne({ nickname });
    });

    socket.on('connected', async (localNickname) => {
      const userExists = await Users.findByNickname(localNickname);

      if (!userExists) {
        Users.insertOne({ nickname: localNickname });
        io.emit('connected', { newUser: localNickname });
      }
    });
});
};
