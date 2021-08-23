const crypto = require('crypto');
const moment = require('moment');
const chatModel = require('../models/chat');

const users = {};

const disconect = (socket, io) => {
  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('userlist', { users });
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('initialList', async () => {
    const newNickname = crypto.randomBytes(20).toString('hex').substr(0, 16);
    const messagesList = await chatModel.getAll();
    socket.emit('messagesList', messagesList);
    users[socket.id] = newNickname;
    io.emit('userlist', { users, newNickname });
  });

  socket.on('message', async ({ chatMessage: message, nickname }) => {
    const timestamp = moment().format('DD-MM-yyyy LTS');
    chatModel.create({ message, nickname, timestamp });
    io.emit('message', `${timestamp} - ${nickname} - ${message}`);
  });

  socket.on('savenickname', (nickname) => {
    users[socket.id] = nickname;
    io.emit('userlist', { users, newNickname: nickname });
  });
  disconect(socket, io);
});