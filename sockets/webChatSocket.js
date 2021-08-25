const moment = require('moment');
const chatModel = require('../models/chatMessageModel');

const dateTime = moment().format('DD-MM-yyyy HH:mm:ss');

const users = [];

const newUser = (nickname, socket) => {
  const user = { nickname, socket };
  users.push(user);
  return user;
};

const online = (io) => {
  io.emit('onlineUser', users.map(({ nickname }) => nickname));
};

const changeNickname = (io, nickname, socket) => {
  users.forEach((user) => {
    const newSockets = user;
    if (user.socket === socket) newSockets.nickname = nickname;
  });
  online(io);
};

const disconnect = (io, socket) => {
  const user = users.find((clients) => clients.socket === socket);
  const index = users.indexOf(user);
  users.splice(index, 1);
  online(io);
};

module.exports = (io) => io.on('connection', (socket) => {
  const { nickname: userNickname } = socket.handshake.query;
  newUser(userNickname, socket);

  socket.on('message', async ({ chatMessage, nickname }) => {
    io.emit('message', `${dateTime} - ${nickname}: ${chatMessage}`);
    await chatModel.createMessage({ message: chatMessage, nickname, timestamp: dateTime });
  });

  socket.on('changeNickname', (newNick) => changeNickname(io, newNick, socket));

  socket.on('disconnect', () => disconnect(io, socket));
  
  online(io);

  socket.emit('connection');

  socket.on('getHistory', async () => {
    const allMessages = await chatModel.getAllMsgs();
    
    const chatHistory = (allMessages).map(({ message, nickname, timestamp }) => (
      `${timestamp} - ${nickname}: ${message}`
      ));
      
      socket.emit('chatHistory', chatHistory);
  });
});