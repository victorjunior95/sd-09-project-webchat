const { Router } = require('express');

const chatModel = require('../models/chatModel');

const chat = new Router();

chat.get('/', async (_req, res) => {
  const chatHistory = await chatModel.getHistory();

  return res.render('index', { chatHistory });  
});

module.exports = chat;