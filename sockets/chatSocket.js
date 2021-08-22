const moment = require('moment');
const formatMessage = require('../utils/formatMessage');
const Message = require('../models/messages');

let users = [];

const getMessages = async (io) => {
  const messages = await Message.getMessages();
  io.emit('restore', messages);
};

module.exports = (io) => io.on('connection', (socket) => {
  let randomNickname = socket.id.slice(0, 16);
  socket.on('newConnection', () => {
    users.push(randomNickname); socket.emit('user', randomNickname); io.emit('onlineUsers', users);
    getMessages(io);
  });
  socket.on('disconnect', () => {
    users = users.filter((user) => user !== randomNickname); io.emit('onlineUsers', users);
  });
  socket.on('message', ({ chatMessage, nickname }) => {
    Message.saveMessages(
      { message: chatMessage, nickname, timestamp: moment().format('DD-MM-yyyy HH:mm:ss') },
  );
    io.emit('message', formatMessage(chatMessage, nickname));
  });
  socket.on('newNickname', ({ newNickname, oldNickname }) => {
    randomNickname = newNickname;
    users[users.indexOf(oldNickname)] = newNickname; io.emit('onlineUsers', users);
  });
});