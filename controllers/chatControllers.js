const chat = require('../models/chatModels');

const getUsers = async (req, res) => {
  const users = await chat.getAll();
  res.render('index', { users });
};

module.exports = { getUsers };