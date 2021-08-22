const Model = require('../models/messages');

const clientList = [];

const disconnectUser = (socket) => {
  socket.on('disconnect', () => {
    const idToDescart = clientList.findIndex((client) => client.id === socket.id);
    clientList.splice(idToDescart, 1);
    socket.broadcast.emit('list', clientList);
  });
};

const newUser = (socket, io) => {
  socket.on('newUser', (data) => {
    clientList.push({ id: socket.id, nickname: data });
    io.emit('list', clientList);
  });
};

const changeUserName = (socket, io) => {
  socket.on('changeUserName', (data) => {
    const user = clientList.find((client) => client.id === socket.id);
    user.nickname = data;
    io.emit('list', clientList);
  });
};

const chat = (io) => {
  io.on('connection', (socket) => {
    newUser(socket, io);

    changeUserName(socket, io);

    socket.on('message', async (message) => {
      const currentDate = (new Date()).toLocaleDateString().replaceAll('/', '-');
      const hour = (new Date()).toLocaleTimeString();
      const date = `${currentDate} ${hour}`;

      await Model.insertMessage(
        { nickname: message.nickname, message: message.chatMessage, timestamp: date },
      );

      io.emit('message', `${date} ${message.nickname}: ${message.chatMessage}`);
    });
    disconnectUser(socket);
  });
};

module.exports = chat;
