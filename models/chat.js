const connection = require('./connection');

const getAll = async () => connection()
  .then((db) => db.collection('messages').find().toArray())
  .then((items) => items.map(({ message, nickname, timestamp }) => ({
    message,
    nickname,
    timestamp,
  })));

const newCreate = async (message, nickname, timestamp) => connection()
  .then((db) => db.collection('messages').insertOne({ message, nickname, timestamp }))
  .then(() => ({ message, nickname, timestamp }));

module.exports = {
  getAll,
  newCreate,
};
// FEITO COM A TRINCA DE 9 E WAR ROOM JRVM / INSTRUTORES