const Model = require('../models/messages');

const getAll = async (req, res) => {
  const messages = await Model.getMessages();

  res.status(200).render('index', { messages });
};

// const createMessage = async (req, res) => {
//   const { nickname, message, timestamp } = req.body;

//   if (nickname && message && timestamp) {
//     await Model.insertMessage({ nickname, message, timestamp });
//     res.redirect('index');
//   }
// };

module.exports = {
  getAll,
};