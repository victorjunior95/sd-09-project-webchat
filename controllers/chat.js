const {
  getMsg,
} = require('../models/chat');

const getMsgControl = async (_req, res) => {
  const chatHistory = await getMsg();
  return res.status(200).json(chatHistory);
};

module.exports = {
  getMsgControl,
};