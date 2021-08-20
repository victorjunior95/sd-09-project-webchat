const db = require('../models/messages');
// adriano me ajudou com as logicas
// github.com/adrianoforcellini
const date = () => {
  const d = new Date();
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}
  ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};
const nickNames = [];
const nicksIndex = [];
const messagesSocket = (io) => {
  io.on('connection', async (socket) => {
    socket.emit('oldMessages');
    socket.on('oldMessages', async () => {
      const messages = await db.findAll();
      socket.emit('sendOldMessages', messages);
    });
    socket.on('message', (data) => {
      const novaData = `${date()} ${data.nickname}:${data.chatMessage}`;
      db.create(novaData);
      socket.broadcast.emit('message', novaData);
      socket.emit('message', novaData);
    });
  });
};
const nickSockets = (io) => {
  io.on('connection', async (socket) => {
    socket.emit('nickname');
    socket.on('nickname', (id) => {
      nickNames.push(id.slice(0, 16));
      nicksIndex.push(id);
      socket.emit('name', id.slice(0, 16));
      socket.emit('allNickNames', nickNames);
      socket.broadcast.emit('allNickNames', nickNames);
    });
    socket.on('changeName', (obj) => {
      const { nickname, newName } = obj;
      nickNames.splice(nickNames.indexOf(nickname), 1, newName);
      socket.emit('allNickNames', nickNames);
      socket.broadcast.emit('allNickNames', nickNames);
    });
  });
};
const disconnect = (io) => {
  io.on('connection', async (socket) => {
    socket.on('disconnect', () => {
      const index = nicksIndex.indexOf(socket.id);
      nicksIndex.splice(index, 1);
      nickNames.splice(index, 1);
      socket.broadcast.emit('allNickNames', nickNames);
    });
  });
};
module.exports = (io) => {
  messagesSocket(io);
  nickSockets(io);
  disconnect(io);
};
