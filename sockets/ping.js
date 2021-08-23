const moment = require('moment');
const messageModel = require('../models/message');

const { getAllMessages, insertMessage } = messageModel;

const currentTime = moment().format('DD-MM-YYYY h:mm:ss');

let onlineUsers = [];

const updateName = (newName, socketId) => {
  onlineUsers = onlineUsers.map((user) => {
    if (user.id.socket !== socketId) {
      return user;
    }
      return { id: { socket: socketId, name: newName } };
  });
};

const userConnected = async (data, socket, io) => {
  console.log(`${socket.id} emitiu um ping!`);
  onlineUsers.push({ id: { socket: socket.id, name: data } });
  const messageHistory = await getAllMessages();
  io.emit('onlineUsers', onlineUsers);
  socket.emit('messageHistory', messageHistory);
};

module.exports = (io) => io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id} `);

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.id.socket !== socket.id);
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('updateName', (newName) => {
    updateName(newName, socket.id);
    io.emit('onlineUsers', onlineUsers);
});

  socket.on('userConnected', (data) => userConnected(data, socket, io));

  socket.on('message', async (data) => {
    //  WhatsApp version
    // const { messageUserId, chatMessage } = data;
    // io.emit('message', { messageUserId, chatMessage });

    //  Project version
    const { chatMessage, nickname } = data;
    await insertMessage(chatMessage, nickname, currentTime);
    io.emit('message', `${currentTime} - ${nickname}: ${chatMessage}`);
  });
});
