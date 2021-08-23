const { newMessage } = require('../controllers/messages');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', async ({ nickname, chatMessage }) => {
      const options = { timeZone: 'America/Bahia' };

      const date = new Date().toLocaleDateString('pt-BR', options).split('/').join('-');
      const time = new Date().toLocaleTimeString('pt-BR', options);

      io.emit('message', `<time>${date} ${time}</time> ${nickname}: ${chatMessage}`);

      newMessage({ chatMessage, nickname, timestamp: `${date} ${time}` });
    });
  });
};