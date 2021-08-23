const connection = require('./connection');

const save = async (message, nickname, timestamp) => {
  await connection().then((db) => {
    db.collection('messages').insertOne({ message, nickname, timestamp });
  });
};

const getAll = async () => {
  return connection().then((db) =>
    db.collection('messages').find({}).toArray());
};

module.exports = {
  save,
  getAll,
};