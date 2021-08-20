const connection = require('./connection');

const saveMsg = async (obj) => {
  const db = await connection();

  const collection = await db.collection('messages');

  await collection.insertOne(obj);
};

const getMsg = async () => {
  const db = await connection();

  const collection = await db.collection('messages');
  const messages = await collection.find({}).toArray();

  return messages;
};

module.exports = {
  saveMsg,
  getMsg,
};