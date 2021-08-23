const messageModel = require('../models/messageModels');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const starterMessages = await messageModel.getMessages();
    socket.emit('starterMessages', starterMessages);
  });
};
