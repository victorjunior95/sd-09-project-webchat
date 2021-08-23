const { Router } = require('express');

const chat = new Router();

chat.get('/', (req, res) => res.render('index'));

module.exports = chat;