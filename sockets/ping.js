const moment = require('moment');

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

  socket.on('ping', (data) => {
    console.log(`${socket.id} emitiu um ping!`);
    onlineUsers.push({ id: { socket: socket.id, name: data } });
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('message', (data) => {
    //  WhatsApp version
    // const { messageUserId, chatMessage } = data;
    // io.emit('message', { messageUserId, chatMessage });

    //  Project version
    const { chatMessage, nickname } = data;
    io.emit('message', `${currentTime} - ${nickname}: ${chatMessage}`);
  });
});
