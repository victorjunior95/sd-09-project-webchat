const moment = require('moment');
const { saveMessage, getAllMessages } = require('../models/chatModel');

const getMessages = () => getAllMessages();

const createMessage = (message, nickname) => saveMessage({
  message,
  nickname,
  timestamp: moment().format('DD-MM-YYYY HH:mm:ss A'),
});

module.exports = { getMessages, createMessage };
