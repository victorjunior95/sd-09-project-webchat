const moment = require('moment');

let userList = [];

module.exports = (io) => io.on('connection', (socket) => {
    // socket.emit('generateUserName', socket.id);
    io.emit('renderUserList', userList);
    socket.emit('generateNickname', socket.id.slice(0, -4));

  socket.on('message', ({ chatMessage, nickname }) => {
    const dateAndTime = moment().format('DD-MM-yyyy  HH:mm:ss');
    const detailedMessage = `${dateAndTime} - ${nickname}: ${chatMessage}`;
    io.emit('message', detailedMessage);
  });

  socket.on('nicknameChange', (nickname) => {
    userList = userList.filter((user) => (user.id !== socket.id));
    userList.push({ id: socket.id, nickname });
    io.emit('renderUserList', userList);
  });
});
