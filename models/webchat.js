const connetion = require('./connection');

const insertMessage = async (message) => {
  const conn = await connetion();
  await conn.collection('messages').insertOne(message);
};

const findMessage = async () => {
  const conn = await connetion();
  const result = await conn.collection('messages').find().toArray();

  return result;
};

module.exports = {
  insertMessage,
  findMessage,
};