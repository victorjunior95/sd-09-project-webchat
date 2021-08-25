const conn = require('./connection');

const getHistory = async () => {
  const db = await conn();
  const result = await db.collection('messages').find().toArray();
  return result;
};

const saveHistory = async ({ nickname, chatMessage, timestamp }) => {
  const db = await conn();
  await db.collection('messages').insertOne({ nickname, chatMessage, timestamp });
};

module.exports = {
  getHistory,
  saveHistory,
};
