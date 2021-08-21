const moment = require('moment');
const { saveMessage } = require('../models/chat');

module.exports = (io) => io.on('connection', async (socket) => {
  const users = [];
  const firstNickname = socket.id.slice(0, 16);
  users.push(firstNickname);
  io.emit('firstConnection', users);

  const timeStamp = moment().format('DD-MM-yyyy LTS');
  socket.on('message', async ({ chatMessage, nickname }) => {
    await saveMessage({ message: chatMessage, nickname, timeStamp });
    io.emit('message', `${timeStamp} - ${nickname}: ${chatMessage}`);
  });
});