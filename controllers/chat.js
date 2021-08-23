const messages = require('../models/test');

const chat = (_req, res) => {
  res.render('chat', { messages });
};

module.exports = chat;
