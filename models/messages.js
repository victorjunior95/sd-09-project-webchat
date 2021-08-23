const connection = require('./connection');

const postMessages = (message) => connection()
.then((db) => db.collection('messages').insertOne(message)).then(({ ops }) => ops[0]);

const getMessages = async () => connection()
.then((db) => db.collection('messages').find().toArray());

module.exports = { postMessages, getMessages };
