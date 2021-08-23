const crypto = require('crypto');
const { save, getAll } = require('../models/messages');

const usersList = {};

const createDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = (date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const fullDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  return fullDate;
};

const setRandomNickname = (socket, io) => {
  socket.on('randomNick', () => {
    usersList[socket.id] = crypto.randomBytes(20).toString('hex').substr(0, 16);
    io.emit('updateUsers', { usersList, name: usersList[socket.id] });
  });
};

const sendInitialUsersList = async (socket) => {
  socket.emit('online', usersList);
  const messagesLog = await getAll();
  socket.emit('updateMessage', messagesLog);
};

const sendUsersList = (socket, io) => {
  socket.on('clientLogin', (newUser) => {
    usersList[socket.id] = newUser;
    io.emit('updateUsers', { usersList, name: newUser });
  });
};

const sendNewMessage = (socket, io) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    if (!usersList[socket.id]) {
      usersList[socket.id] = nickname || crypto.randomBytes(20).toString('hex').substr(0, 16);
    }
    const userNick = usersList[socket.id];
    await save(chatMessage, userNick, createDate());
    const message = `${createDate()} - ${userNick}: ${chatMessage}`;
    io.emit('message', (message));
  });
};

const removeUser = (socket, io) => {
  socket.on('disconnect', () => {
    delete usersList[socket.id];
    io.emit('updateUsers', { usersList });
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  setRandomNickname(socket, io);
  sendInitialUsersList(socket);
  sendUsersList(socket, io);
  sendNewMessage(socket, io);
  removeUser(socket, io);
});