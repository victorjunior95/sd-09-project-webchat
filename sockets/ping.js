const moment = require('moment');

const currentTime = moment().format('DD-MM-YYYY h:mm:ss');

module.exports = (io) => io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id} `);

  socket.emit('myId', socket.id);

  socket.on('ping', () => {
    console.log(`${socket.id} emitiu um ping!`);
  });

  socket.on('message', (data) => {
    // const { messageUserId, chatMessage } = data;
    // io.emit('message', { messageUserId, chatMessage });

    //  Project version
    const { chatMessage, nickname } = data;
    io.emit('message', `${currentTime} - ${nickname}: ${chatMessage}`);
  });
});