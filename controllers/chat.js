const messages = require('../models/test');

const chat = (_req, res) => {
  res.status(200).render('webchat', { messages });
};

module.exports = chat;
