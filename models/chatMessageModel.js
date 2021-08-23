const connection = require('./connection');

const addChatMessage = async (data) => {
  const db = await connection();
  const message = db.collection('messages').insertOne(data);
  return message;
};

const getChatMessages = async () => {
  const db = await connection();
  const message = db.collection('messages').find().toArray();
  return message;
};

module.exports = {
  addChatMessage,
  getChatMessages,
};
