module.exports = (io) => {
  io.on('connection', (socket) => {
    io.emit('login', socket.id);

    socket.on('clientNickname', (nickname) => {
      console.log(`${socket.id} mudou o nickname para ${nickname}`);
    });

    socket.on('message', ({ chatMessage, nickname }) => {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const second = String(date.getSeconds()).padStart(2, '0');
    
      const time = `${day}-${month}-${date.getFullYear()} ${hour}:${minute}:${second}`;

      const messageToRender = `${time} - ${nickname}: ${chatMessage}`;

      io.emit('message', messageToRender);
    });
  });
};
