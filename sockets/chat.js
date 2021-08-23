const moment = require('moment');
const chatModel = require('../models/chatModel');

let userList = [];

function handleMessage(io, socket) {
  socket.on('message', ({ chatMessage, nickname }) => {
    const dateAndTime = moment().format('DD-MM-yyyy  HH:mm:ss');
    const detailedMessage = `${dateAndTime} - ${nickname}: ${chatMessage}`;
    chatModel.addMessage({ message: chatMessage, nickname, timestamp: dateAndTime });
    io.emit('message', detailedMessage);
  });
}

function handleNicknameChange(io, socket) {
  socket.on('nicknameChange', (nickname) => {
    userList = userList.filter((user) => (user.id !== socket.id));
    userList.push({ id: socket.id, nickname });
    io.emit('renderUserList', userList);
  });
}

async function handleMessageHistory(io, socket) {
  const messages = await chatModel.getMessages();
  socket.emit('messageHistory', messages);
}

module.exports = (io) => io.on('connection', (socket) => {
  io.emit('renderUserList', userList);
  socket.emit('generateNickname', socket.id.slice(0, -4));
  handleMessageHistory(io, socket);
  handleMessage(io, socket);
  handleNicknameChange(io, socket);

  socket.on('disconnect', () => {
    userList = userList.filter((user) => (user.id !== socket.id));
    io.emit('renderUserList', userList);
  });
});
