const connection = require('./connection');

const createMessage = async (message, nickname, timestamp) => (
  connection().then(async (db) => {
  await db.collection('messages')
    .insertOne({ message, nickname, timestamp });
  })
);

const messageHistory = async () => (
  connection().then(async (db) => {
  const allMessages = await db.collection('messages').find().toArray();
  return allMessages;
  })
);

module.exports = {
  createMessage, 
  messageHistory, 
};
