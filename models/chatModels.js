const connection = require('./connection');

const createMessage = async (message, nickname, timestamp) => {
  await connection()
    .then((db) => db.collection('messages').insertOne({
      message,
      nickname,
      timestamp,
    }));  
};

const getMessages = async () => connection()
  .then((db) => db.collection('messages').find({}).toArray());

module.exports = { createMessage, getMessages };
