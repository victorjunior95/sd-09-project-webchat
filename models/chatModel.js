const connection = require('./connection');

const addMessage = (messageInfo) => {
  connection()
    .then((db) => db.collection('messages').insertOne(messageInfo))
    .then((resolve) => resolve.ops[0]);
};

const getAllMessages = () => {
  connection()
    .then((db) => db.collection('messages').find().toArray());
};

module.exports = {
  addMessage,
  getAllMessages,
};
