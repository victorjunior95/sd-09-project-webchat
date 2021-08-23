const connection = require('./connection');

const message = 'messages';

async function saveMessage(messageToSave) {
  return connection()
    .then((db) => db.collection(message).insertOne(messageToSave));
}

async function getMessages() {
  return connection()
    .then((db) => db.collection(message).find({}).toArray());
}

module.exports = {
  saveMessage,
  getMessages,
};
