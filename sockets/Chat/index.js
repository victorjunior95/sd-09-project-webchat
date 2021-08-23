const createNickName = require('../../utils/createNickName');
const dateNowFormated = require('../../utils/dateNowFormated');
const CreateMessage = require('../../models/CreateMessage');
const GetMessages = require('../../models/GetMessages');

let users = [];

const disconnectUser = (socket) => {
  users = users.filter((user) => user.id !== socket.id);
  socket.broadcast.emit('logout', users);
};

const message = (io, nickname, chatMessage) => {
  const date = dateNowFormated();
  CreateMessage({ message: chatMessage, nickname, timestamp: date });
  io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
};

const changeNickName = (io, socket, newNick) => {
  const userUpdate = users.find((user) => user.id === socket.id);
  userUpdate.nickName = newNick;
  io.emit('changeNickName', users);
};

module.exports = (io) =>
  io.on('connection', async (socket) => {
    socket.emit('welcome', {
      nickname: createNickName(16),
      messages: await GetMessages(),
      users,
    });
    socket.on('login', (nickname) => {
      users.push({ id: socket.id, nickName: nickname });
      socket.broadcast.emit('newUser', users);
    });
    socket.on('message', ({ nickname, chatMessage }) => message(io, nickname, chatMessage));
    socket.on('nickname', (nickname) => io.emit('refreshUsers', nickname));
    socket.on('changeNickName', (newNick) => changeNickName(io, socket, newNick));

    socket.on('disconnect', () => disconnectUser(socket));
  });
