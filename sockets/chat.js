const moment = require('moment');
const { loadMessages, saveMessage } = require('../models/messages');

const messagesHistory = async () => loadMessages();
const saveHistory = async ({ timestamp,
  nickname,
  chatMessage }) => saveMessage({ timestamp, nickname, chatMessage });

const timestamp = moment().format('DD-MM-YYYY HH:mm:ss');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    socket.emit('connected');
    socket.emit('showHistory', await messagesHistory());

    socket.on('nicknameChange', (newNickname) => { 
      io.emit('nicknameChange', newNickname);
     });
     
    socket.on('message', async ({ chatMessage, nickname }) => {
      await saveHistory({ timestamp, nickname, chatMessage });
      io.emit('message', `${timestamp} ${nickname} diz: ${chatMessage}`);
    });

    socket.broadcast.emit('online', `${socket.id} está online`);
  });
};