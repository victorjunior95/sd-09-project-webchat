const connection = require('./connection');

const getMessages = async () => {
  const db = await connection();
  const messages = await db.collection('messages').find().toArray();
  return messages;
};

const createMessage = async (data) => {
  const db = await connection();
  const { ops } = await db.collection('messages').insertOne(data);
  return ops[0];
};

module.exports = {
  getMessages,
  createMessage,
};