const connection = require('./connection');

const setData = async (timestamp, nickname, chatMessage) => connection()
  .then((db) => db.collection('messages').insertOne({ timestamp, nickname, chatMessage }))
  .then(() => ({ timestamp, nickname, chatMessage }));

const getAll = async () => connection()
  .then((db) => db.collection('messages').find().toArray())
  .then((data) => data.map(({ timestamp, nickname, chatMessage }) => ({
    timestamp,
    nickname,
    chatMessage,
  })));

module.exports = {
  setData,
  getAll,
};
