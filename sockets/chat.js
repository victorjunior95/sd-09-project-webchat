const moment = require('moment'); // referência: https://tableless.com.br/trabalhando-com-moment/

// eslint-disable-next-line sonarjs/no-unused-collection
// const users = [];

module.exports = (io) => io.on('connection', (socket) => {
  socket.emit('serverMessage', 'Bem vindo ao chat!');
  
  socket.on('login', async (nickName) => {
    // users.push(nickName);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit(
      'message',
      `${moment().format('DD-MM-yyyy LTS')} - ${nickname}: ${chatMessage}`,
    );
  });
});