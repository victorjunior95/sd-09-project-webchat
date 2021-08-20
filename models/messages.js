const connection = require('./connection');

const create = (chatMessage, nickname, timestamp) => {
  connection().then((db) => db.collection('messages')
    .insertOne({ chatMessage, nickname, timestamp }));
};
const getAll = () => connection().then((db) => db.collection('messages').find({}).toArray());

module.exports = {
    create,
    getAll,
}; 