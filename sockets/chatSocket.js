const formatMessage = require('../utils/formatMessage');

let users = [];

module.exports = (io) => io.on('connection', (socket) => {
  const randomNickname = socket.id.slice(0, 16);
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
    const index = users.indexOf(oldNickname);
    users[index] = newNickname;
    io.emit('onlineUsers', users);
  });
});