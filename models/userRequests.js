const connection = require('./connection');

const users = 'users';

async function getUsers() {
  return connection()
    .then((db) => db.collection(users).find({}).toArray());
}

async function createUser(newUser) {
  return connection()
    .then((db) => db.collection(users).insertOne({ name: 'listaDeUsuarios', users: [newUser] }));
}

async function insertUser(userToUpdate) {
  return connection()
    .then((db) => db.collection(users)
      .updateOne(
        { name: 'listaDeUsuarios' },
        { $push: { users: userToUpdate } },
        { upsert: true },
      ));
}

async function deleteUser(userToDelete) {
  return connection()
    .then((db) => db.collection(users)
      .updateMany({}, { $pull: { users: { socketId: { $eq: userToDelete } } } }));
}

async function updateNickname(user, newNickname) {
  return connection()
    .then((db) => db.collection(users)
      .updateOne(
        { name: 'listaDeUsuarios' },
        { $set: { 'users.$[element].nickname': newNickname } },
        { arrayFilters: [{ 'element.socketId': user }] },
      ));
}

module.exports = {
  getUsers,
  createUser,
  insertUser,
  deleteUser,
  updateNickname,
};
