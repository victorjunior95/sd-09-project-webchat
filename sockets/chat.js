const Model = require('../models/messages');

let clientList = [];

const changeIndexPosition = (arr, fromIndex, toIndex) => {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
  return arr;
};

const disconnectUser = (socket) => {
  socket.on('disconnect', () => {
    const newClientFilteredList = clientList.filter((client) => client.id !== socket.id);
    socket.broadcast.emit('desconectou', newClientFilteredList);
    clientList = newClientFilteredList;
  });
};

const changeUserNameInList = (socket) => {
  socket.on('changeName', (name) => {
    clientList.find((client) => client.id === socket.id).nickname = name;
    socket.emit('list', clientList);
    socket.broadcast.emit('list', changeIndexPosition(clientList, clientList.length - 1, 0));
  });
};

const iJustGotHere = (socket) => {
  socket.on('cheguei', (data) => {
    clientList.push({ id: socket.id, nickname: data });
    socket.broadcast.emit('list', clientList);
    socket.emit('list', changeIndexPosition(clientList, clientList.length - 1, 0));
  });
};

const chat = (io) => {
  io.on('connection', (socket) => {
    iJustGotHere(socket);

    changeUserNameInList(socket);

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
