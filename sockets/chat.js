const chat = (io) => {
  io.on('connection', (socket) => {    
    console.log('ola ', socket.id);
    socket.on('message', (message) => {
      console.log(message);
      const currentDate = (new Date()).toLocaleDateString().replaceAll('/', '-');
      const hour = (new Date()).toLocaleTimeString();
      const date = `${currentDate} ${hour}`;
      io.emit('message', `${date} ${message.nickname}: ${message.chatMessage}`);
    });
  });
};

module.exports = chat;
