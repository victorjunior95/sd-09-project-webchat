const connect = require('./connection');

const getAll = async () => connect()
  .then((db) => db.collection('messages').find().toArray());

const register = async (data) => connect()
  .then((db) => db.collection('messages').insertOne(data)
  .then(({ ops }) => ops[0]));

module.exports = {
  register,
  getAll,
};
