const model = require('../models/chat');

module.exports = async (_req, res) => {
  const messages = await model.getMessages();

  res.status(200).render('webchat', { messages });
};
