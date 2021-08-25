const connection = require('./connection');

const getMessages = () => {
  const messages = connection()
    .then((db) => db.collection('messages').find().toArray());
  return messages;
};

const saveMessage = (message, nickname, time) => connection()
    .then((db) => db.collection('messages').insertOne({
      message,
      nickname,
      time,
    }));

module.exports = {
  getMessages,
  saveMessage,
};