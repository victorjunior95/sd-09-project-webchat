const connection = require('./connection');

const saveMessage = async ({ message, nickname, timeStamp }) => {
  await connection().then((db) => db.collection('messages').insertOne(
    { message, nickname, timeStamp },      
  ));
  return null;
};

const getAllMessages = async () => {
  const allMessages = await connection()
    .then((db) => db.collection('messages').find({}).toArray());
  return allMessages;
};

module.exports = { saveMessage, getAllMessages };