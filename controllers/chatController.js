const chatMessageModel = require('../models/chatMessageModel');

const getChatMessages = async (_req, res) => {
  try {
    const messages = await chatMessageModel.getChatMessages();
    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getChatMessages,
};
