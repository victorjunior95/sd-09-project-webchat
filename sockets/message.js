const moment = require('moment');
const messageModel = require('../models/messageModels');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', async ({ chatMessage, nickname }) => {
      const time = moment().format('D-MM-YYYY - h:mm:ss a');
      const messageToRender = `${time} - ${nickname}: ${chatMessage}`;

      const messageToSave = {
        message: chatMessage,
        nickname,
        timestamp: time,
        messageToRender,
      };

      await messageModel.saveMessage(messageToSave);

      // const messages = await messageModel.getMessages();
      io.emit('message', messageToRender);
    });
  });
};
