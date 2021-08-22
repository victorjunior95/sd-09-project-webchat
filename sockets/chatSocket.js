const formatMessage = require('../utils/formatMessage');

let users = [];

module.exports = (io) => io.on('connection', (socket) => {
  let randomNickname = socket.id.slice(0, 16);
  socket.on('newConnection', () => {
    users.push(randomNickname);
    socket.emit('user', randomNickname);
    io.emit('onlineUsers', users);
  });
  socket.on('disconnect', () => {
    users = users.filter((user) => user !== randomNickname);
    io.emit('onlineUsers', users);
  });
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', formatMessage(chatMessage, nickname));
  });
  socket.on('newNickname', ({ newNickname, oldNickname }) => {
    randomNickname = newNickname;
    users[users.indexOf(oldNickname)] = newNickname;
    io.emit('onlineUsers', users);
  });
});