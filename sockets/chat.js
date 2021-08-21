const moment = require('moment');

module.exports = (io) => io.on('connection', (socket) => {
  const users = [];
  const firstNickname = socket.id.slice(0, 16);
  users.push(firstNickname);
  io.emit('firstConnection', users);

  const timeStamp = moment().format('DD-MM-yyyy LTS');
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${timeStamp} - ${nickname}: ${chatMessage}`);
  });
});