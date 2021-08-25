const moment = require('moment');
const { saveMessage } = require('../models/chat');

let users = [];

module.exports = (io) => io.on('connection', async (socket) => {
  const firstNickname = socket.id.slice(0, 16);
  users.push({ nickname: firstNickname, socketId: socket.id });
  io.emit('listUsers', users);
  const timeStamp = moment().format('DD-MM-yyyy LTS');
  socket.on('message', async ({ chatMessage, nickname }) => {
    await saveMessage({ message: chatMessage, nickname, timeStamp });
    io.emit('message', `${timeStamp} - ${nickname}: ${chatMessage}`);
  });
  socket.on('newNickName', (nickname) => {
    users = users.map((user) => {
      if (user.socketId === socket.id) return { ...user, nickname };
        return user;
    });
    io.emit('listUsers', users);
  });
  socket.on('disconnect', () => { 
    users = users.filter((user) => user.socketId !== socket.id); io.emit('listUsers', users);
  });
});