/* eslint-disable max-lines-per-function */
const nickNames = [];
const Ids = [];

const onConnect = (io) => {
  io.on('connection', async (socket) => {
    socket.emit('nickname');

    socket.on('sendName', (data) => {
      nickNames.push(data[0]);
      Ids.push(data[1]);
      socket.broadcast.emit('receivedNames', nickNames);
      socket.emit('receivedNames', nickNames);
    });

    socket.on('changeName', (objNames) => {
      const { oldName, newName } = objNames;
      nickNames.splice(nickNames.indexOf(oldName), 1, newName);
      socket.broadcast.emit('receivedNames', nickNames);
      socket.emit('receivedNames', nickNames);
    });
  });
};

const onDisconnect = (io) => {
  io.on('connection', async (socket) => {
    socket.on('disconnect', () => {
      const index = Ids.indexOf(socket.id);
      nickNames.splice(index, 1);
      Ids.splice(index, 1);
      socket.broadcast.emit('receivedNames', nickNames);
      socket.emit('receivedNames', nickNames);
    });
  });
};

module.exports = (io) => {
  onDisconnect(io);
  onConnect(io);
};
