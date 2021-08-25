const moment = require('moment'); // referência: https://tableless.com.br/trabalhando-com-moment/
const messagesModel = require('../models/messages');

const users = [];
const historicMessages = [];

const formatMessage = (message, nickname, timestamp) => {
  const chatMessage = `${timestamp} - ${nickname}: ${message}`;
  return chatMessage;
};

const formatHistoric = (messages) => {
  messages.forEach(({ message, nickname, timestamp }) => {
    historicMessages.push(formatMessage(message, nickname, timestamp));
  });
};

const updateUsers = (nickname, userId) => {
  users.forEach((user, index) => {
    if (user.id === userId) users[index].nickname = nickname;
  });
};

const deleteUser = (userId) => {
  users.forEach((user, index) => {
    if (user.id === userId) users.splice(index, 1);
  });
  return users;
};

const orderUsers = (currUser) => {
  const newUsers = [];
  const oldUsers = users.filter((user) => user.id !== currUser.id);
  newUsers.push(currUser, ...oldUsers);
  return newUsers;
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('login', async (nickname) => {
    users.push({ nickname, id: socket.id });
    const messages = await messagesModel.getAllMessages();
    formatHistoric(messages);
    socket.broadcast.emit('onlineUsers', users, historicMessages);
    socket.emit('onlineUsers', orderUsers({ nickname, id: socket.id }), historicMessages);
  });
  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
    const timestampMsg = moment().format('DD-MM-yyyy LTS');
    await messagesModel.createMessage(chatMessage, nickname, timestamp);
    io.emit('message', formatMessage(chatMessage, nickname, timestampMsg));
  });
  socket.on('updateUser', (nickName) => {
    updateUsers(nickName, socket.id);
    io.emit('updateUser', users);
  });
  socket.on('disconnect', () => socket.broadcast.emit('deletedUser', deleteUser(socket.id)));
});