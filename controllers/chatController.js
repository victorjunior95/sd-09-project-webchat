const chatModels = require('../models/chatModels');

const createMessage = async (_payload) => {
  // await chatModels.createMessage(payload);
};

const getMessages = async (_req, res) => {
  /* const messages = [
    {
      message: 'Lorem ipsum',
      nickname: 'xablau',
      timestamp: '2021-04-01 12:00:00',
    },
  ]; */
  const messages = await chatModels.getMessages();
  // console.log(messages);
  res.render('index', { messages });
};

module.exports = {
  createMessage,
  getMessages,
};