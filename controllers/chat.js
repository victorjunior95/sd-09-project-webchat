const model = require('../models/chat');

const chat = async (_req, res) => {
  const messages = await model.getMessages();

  res.status(200).render('webchat', { messages });
};

module.exports = chat;
