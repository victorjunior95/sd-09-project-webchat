const path = require('path');

const chatModels = require('../models/chatModels');

const getMessages = (_req, res) => {
  const messages = chatModels.getAll();
  console.log(messages);
  res.sendFile(path.join(__dirname, '/public/index.html'));
};

module.exports = {
  getMessages,
};