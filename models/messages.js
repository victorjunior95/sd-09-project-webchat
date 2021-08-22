const connection = require('./connection');

const getMessages = async () => 
  connection()
    .then((db) => db.collection('messages').find().toArray());

const insertMessage = async (nickname, message, timestamp) => 
  connection()
    .then((db) => db.collection('messages')
      .insertOne(nickname, message, timestamp));

module.exports = {
  getMessages,
  insertMessage,
};