const connection = require('./connection');

const getAllMessages = () => connection().then((db) =>
db.collection('messages').find({}).toArray());

const insertMessage = (message, nickname, timestamp) => connection().then((db) =>
db.collection('messages').insertOne({ message, nickname, timestamp }));

module.exports = {
  getAllMessages,
  insertMessage,
};