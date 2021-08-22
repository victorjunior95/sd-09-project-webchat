const connection = require('./connection');

const getMessages = () => connection()
  .then((db) => db.collection('messages').find().toArray());

const saveMessages = (message) => connection()
  .then((db) => db.collection('messages').insertOne({ ...message }));

module.exports = {
  getMessages,
  saveMessages,
};