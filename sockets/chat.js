const MessageModel = require('../models/Message');

const getDateTimeNow = () => {
  const dateActual = new Date().toLocaleString();
  return dateActual.replace(/\//g, '-');
};

const formatedMessage = ({ message, nickname, timestamp }) =>
  `${timestamp} - ${nickname}: ${message}`;

// recebe mensagens do banco de dados
const allPreviousMessages = async () => {
  const messages = await MessageModel.getAll();
  const formated = messages.map((message) => formatedMessage(message));
  return formated;
};

module.exports = (io) =>
  io.on('connection', async (socket) => {
    console.log(`Usuário conectado. ID: ${socket.id} `);
    const allMessages = await allPreviousMessages();

    // exibe mensagens anteriores ao login
    socket.emit('allMessages', allMessages);

    // recebe as mensagens do frontend
    socket.on('message', async ({ chatMessage, nickname }) => {
      const objMessage = {
        message: chatMessage,
        nickname,
        timestamp: getDateTimeNow(),
      };

      await MessageModel.addMessage(objMessage);

      const messageString = formatedMessage(objMessage);

      // retorna a mensagem para todos os usuarios conectados
      socket.emit('message', messageString);
      socket.broadcast.emit('message', messageString);
    });
  });
