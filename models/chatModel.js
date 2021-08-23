const connection = require('./connection');

async function addMessage(message) {
  const db = await connection();
  await db.collection('messages').insertOne(message);
}

async function getMessages() {
  const db = await connection();
  const response = await db.collection('messages').find().toArray();
  return response;
}

module.exports = {
  addMessage,
  getMessages,
};
