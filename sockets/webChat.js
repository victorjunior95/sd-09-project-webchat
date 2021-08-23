const moment = require('moment');

module.exports = (io, webChatController) => {
  const userList = {};
  
  io.on('connection', (socket) => {
    const currentTime = moment().format('DD-MM-yyyy LTS');

    socket.on('message', ({ chatMessage, nickname }) => {
      const messageBody = `${currentTime} - ${nickname}: ${chatMessage}`;
      io.emit('message', messageBody);
      webChatController.saveMessage(messageBody);
    });

    socket.on('changeNickname', (newNickname) => { 
      userList[socket.id] = newNickname;
      io.emit('userList', userList);
    });

    socket.on('disconnect', () => {
      delete userList[socket.id];
      io.emit('userList', userList);
    });
  });
};
