const createNickName = require('../../utils/createNickName');
const dateNowFormated = require('../../utils/dateNowFormated');
const CreateMessage = require('../../models/CreateMessage');
const GetMessages = require('../../models/GetMessages');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    socket.emit('welcome', { nickname: createNickName(16), messages: await GetMessages() });

    socket.on('message', ({ nickname, chatMessage }) => {
      const date = dateNowFormated();
      CreateMessage({ message: chatMessage, nickname, timestamp: date });
      io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
    });

    socket.on('login', (nickname) => socket.broadcast.emit('newUser', nickname));

    socket.on('nickname', (nickname) => io.emit('refreshUsers', nickname));

    socket.on('logout', (nickname) => socket.broadcast.emit('logout', nickname));

    socket.on('changeNickName', (nicksNames) =>
      socket.broadcast.emit('changeNickName', nicksNames));
  });
};
