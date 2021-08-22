const Model = require('../models/messages');

const getAll = async (req, res) => {
  const messages = await Model.getMessages();

  res.status(200).render('index', { messages });
};

module.exports = {
  getAll,
};