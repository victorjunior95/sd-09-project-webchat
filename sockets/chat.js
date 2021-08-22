const Model = require('../models/messages');

const chat = (io) => {
  io.on('connection', (socket) => {    
    socket.on('message', async (message) => {
      console.log(message);
      const currentDate = (new Date()).toLocaleDateString().replaceAll('/', '-');
      const hour = (new Date()).toLocaleTimeString();
      const date = `${currentDate} ${hour}`;

      await Model.insertMessage(
        { nickname: message.nickname, message: message.chatMessage, timestamp: date },
      );

      io.emit('message', `${date} ${message.nickname}: ${message.chatMessage}`);
    });
  });
};

module.exports = chat;
