const moment = require('moment'); // referência: https://tableless.com.br/trabalhando-com-moment/
const messagesModel = require('../models/messages');

const users = [];
const historyMessages = [];

const formatMessage = (message, nickname, timestamp) => {
  const chatMessage = `${timestamp} - ${nickname}: ${message}`;
  return chatMessage;
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.emit('serverMessage', 'Bem vindo ao chat!');
  
  socket.on('login', async (nickName) => {
    users.push(nickName);
    const messages = await messagesModel.getAllMessages();
    messages.forEach(({ message, nickname, timestamp }) => {
      historyMessages.push(formatMessage(message, nickname, timestamp));
    });
    io.emit('onlineUsers', users, messages);
    io.emit('history', historyMessages);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
    await messagesModel.createMessage(chatMessage, nickname, timestamp);
    io.emit(
      'message',
      formatMessage(chatMessage, nickname, moment().format('DD-MM-yyyy LTS')),
    );
  });
});