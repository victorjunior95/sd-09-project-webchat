const connection = require('./connection');

const saveMessage = async ({ message, nickname, timestamp }) => (
  connection().then(async (db) => {
      const msg = await db.collection('messages').insertOne({
        message, nickname, timestamp,
      });
      return msg.ops[0];
  })
);

const getAllMessages = () =>
  connection().then((db) => db.collection('messages').find().toArray());

module.exports = {
  saveMessage,
  getAllMessages,
};
