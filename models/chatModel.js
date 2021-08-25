const connection = require('./connection');

const getMessages = () => {
  const messages = connection()
    .then((db) => db.collection('messages').find().toArray());
  return messages;
};

const saveMessage = (messages, nickname, time) => connection()
    .then((db) => db.collection('messages').insertOne({
      msg: messages,
      nick: nickname,
      time,
    }));

module.exports = {
  getMessages,
  saveMessage,
};