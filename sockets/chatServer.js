const moment = require('moment');

const generateNickname = require('../utils/generateNick');
const chatModel = require('../models/chatModel');

const users = [];

const customizeNick = (socket, io) => {
  socket.on('customizeNick', (newNickname) => {
    let indexUser;
    users.forEach(({ id }, index) => {
      if (id === socket.id) indexUser = index;
    });
    users[indexUser].nickname = newNickname;
    console.log(users);
    io.emit('onlineUsers', users);
  });
};

const loggedOutUser = (socket, io) => {
  socket.on('disconnect', () => {
    let indexUser;
    users.forEach(({ id }, index) => {
      if (id === socket.id) indexUser = index;
    });
    users.splice(indexUser, 1);
    console.log(users);
    io.emit('onlineUsers', users);
    return false;
  });
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    const initNick = generateNickname();

    users.push({ id: socket.id, nickname: initNick });
    socket.emit('initNick', initNick);

    io.emit('onlineUsers', users);

    socket.on('message', async ({ chatMessage, nickname }) => {
      const timestamp = moment().format('DD-MM-YYYY HH:mm:ss A');
      const message = `${timestamp} - ${nickname}: ${chatMessage}`;

      await chatModel.saveHistory({ nickname, chatMessage, timestamp });

      io.emit('message', message);
    });

    customizeNick(socket, io);

    loggedOutUser(socket, io);
  });
};
