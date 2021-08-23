const chatModel = require('../models/chatModels');

const users = {};

const formatDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return `${day}-${month}-${year} ${hour}:${min}:${sec}`;
};

const handleCientConnect = (socket) => {
  console.log(`[${socket.id}] > acabou de se conectar!`);
  socket.emit('requestNickname', 'Envie seu nickname');
};

const handleMessages = (socket, io) => {
  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;

    const date = formatDate();
    const formatMessage = `${date} - ${nickname}: ${chatMessage}`;

    // Persistencia no banco de dados
    chatModel.createMessage(chatMessage, nickname, date);

    io.emit('message', formatMessage);
  });
};

const handleUsers = (socket, io) => {
  // evento personalizado para lidar com os usuarios ativos
  socket.on('users', (nickname) => {
    users[socket.id] = nickname;
    console.log('[addUser][users] > ', users);
    io.emit('users', users);
  });
};

const handleUpdateNickname = (socket, io) => {
  socket.on('updateNickname', (newNickname) => {
    const oldNickname = users[socket.id];
    users[socket.id] = newNickname;
    console.log(`[antigo]: ${oldNickname} -> [novo]: ${users[socket.id]}`);
    console.log('[updateNickname][users] > ', users);
    io.emit('users', users);
  });
};

/**
 * Sempre que um cliente fecha ou recarrega a página, a conexão socket é encerrada
 *  e o socket.io dispara automaticamente um evento disconnect.
 */

const handleDisconnect = (socket) => {
  socket.on('disconnect', () => {
    console.log(`[${socket.id}] desconectou-se`);
    delete users[socket.id];
    console.log('[disconnect][users] > ', users);
    // envia para todos os clientes exceto que se desconectou
    socket.broadcast.emit('users', users);
  });
};

const socketServer = (io) => io.on('connection', (socket) => {
  handleCientConnect(socket);
  handleMessages(socket, io);
  handleUsers(socket, io);
  handleUpdateNickname(socket, io);
  handleDisconnect(socket);
});

module.exports = socketServer;
