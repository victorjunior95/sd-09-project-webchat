const chatModels = require('../models/chatModels');

const createMessage = async (payload) => {
  await chatModels.createMessage(payload);
};

const getMessages = (_req, res) => {
  const messages = chatModels.getMessages();
  console.log(messages);
  res.render('index', { messages });
};

module.exports = {
  createMessage,
  getMessages,
};