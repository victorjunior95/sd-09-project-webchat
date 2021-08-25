const connection = require('./connection');

const createMessage = async ({ message, nickname, timestamp }) => {
  const db = await connection();
  const newMsg = await db.collection('messages').insertOne({ message, nickname, timestamp });
  return newMsg.ops[0];
};

const getAllMsgs = async () => {
  const db = await connection();
  const allMsgs = await db.collection('messages').find().toArray();
  return allMsgs;
};

module.exports = {
  createMessage,
  getAllMsgs,
};