const connection = require('./connection');

const postMessage = (messageData) =>
  connection().then((db) => db.collection('messages').insertOne(messageData));

const getMessages = () => connection().then((db) => db.collection('messages').find().toArray());

module.exports = {
  postMessage,
  getMessages,
};
