const connection = require('./connection');

const insertMessage = async (msg) => {
  const db = await connection();
  const message = await db.collection('messages').insertOne(msg);
  return message;
};

const searchAllMessages = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find().toArray();
  return messages;
};

module.exports = {
  insertMessage,
  searchAllMessages,
};
