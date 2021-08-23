const moment = require('moment');
const { loadMessages, saveMessage } = require('../models/messages');

const messagesHistory = async () => loadMessages();
const saveHistory = async ({ timestamp,
  nickname,
  chatMessage }) => saveMessage({ timestamp, nickname, chatMessage });

const timestamp = moment().format('DD-MM-YYYY HH:mm:ss');

const onlineUsers = {};

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const userNickname = socket.id.slice(1, 17);
    onlineUsers[socket.id] = userNickname;

    socket.emit('showHistory', await messagesHistory());

    // Para limpar o código, geramos um só emit para atualizar os nicks de todos os usuários quando forem alterados.
    io.emit('usersList', onlineUsers);

    socket.on('nicknameChange', (newNickname) => { 
      onlineUsers[socket.id] = newNickname;
      io.emit('usersList', onlineUsers);
    });
    
    socket.on('message', async ({ chatMessage, nickname }) => {
      await saveHistory({ timestamp, nickname, chatMessage });
      io.emit('message', `${timestamp} ${nickname} diz: ${chatMessage}`);
    });
    socket.on('disconnect', () => {
      delete onlineUsers[socket.id];
      io.emit('usersList', onlineUsers);
    });
  });
};