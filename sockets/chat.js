const chatModels = require('../models/chatModels');

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

const handleMessages = (socket, io) => {
  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;

    console.log('[id] > ', socket.id);

    const date = formatDate();
    const formatMessage = `${date} - ${nickname}: ${chatMessage}`;

    io.emit('message', formatMessage);
    io.emit('users', { id: socket.id, nickname });
  });
};

const socketServer = (io) => io.on('connection', (socket) => {
  handleMessages(socket, io);
  /* socket.on('message', (message) => {
    const { chatMessage, nickname } = message;

    console.log('[id] > ', socket.id);

    const date = formatDate();
    const formatMessage = `${date} - ${nickname}: ${chatMessage}`;

    io.emit('message', formatMessage);
    io.emit('users', { id: socket.id, nickname });
  }); */
});

module.exports = socketServer;
/* module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', (message) => {
    const { chatMessage, nickname } = message;

    console.log('[id] > ', socket.id);

    const date = formatDate();
    const formatMessage = `${date} - ${nickname}: ${chatMessage}`;

    io.emit('message', formatMessage);
    io.emit('users', { id: socket.id, nickname });
  });
}); */
