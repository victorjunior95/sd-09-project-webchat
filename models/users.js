const connection = require('./connection');

const insertOne = async (user) => (
  connection()
  .then(
    (db) => db
      .collection('users')
        .insertOne(user),
  )
);

const find = async () => (
  connection()
    .then(
      (db) => db
        .collection('users')
          .find().toArray(),
    )
);

const findByNickname = async (nickname) => (
  connection()
    .then(
      (db) => db
        .collection('users')
          .findOne({ nickname }),
    )
);

const updateOne = async (old, updated) => (
  connection()
    .then(
      (db) => db
        .collection('users')
          .updateOne(old, { $set: { updated } }),
    )
);

const deleteOne = async (id) => (
  connection()
    .then(
      (db) => db
        .collection('users')
          .deleteOne({ id }),
    )
);

module.exports = { insertOne, find, findByNickname, updateOne, deleteOne };