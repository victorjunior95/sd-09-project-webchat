const moment = require('moment'); // lib de data e tempo

const webchatController = require('../controllers/Webchat');

// Array de users online
let users = [];

const defaultMsg = (obj) => `${obj.timestamp} - ${obj.nickname}: ${obj.message}`;
const arrayMsgString = (arr) => arr.map((obj) => defaultMsg(obj));

const socketWebchat = (io) => {
  // Conexão do client com o nosso server (socket.io)
  // cada socket é um client que se conecta
  io.on('connection', async (socket) => {
    const messages = await webchatController.getAllMessages();

    const guestRandom = socket.id.slice(0, 16);
    users.push(guestRandom);
    socket.emit('nickname', guestRandom);

    socket.emit('history', arrayMsgString(messages));

    // Escuta o evento message do front-end
      // data é um obj { chatMessage, nickname }
    socket.on('message', (data) => {
      const timestamp = moment().format('DD-MM-yyyy HH:mm:ss A');
      const defaultData = { message: data.chatMessage, nickname: data.nickname, timestamp };

      webchatController.registerSocket(defaultData);

      // para renderizar as msg
      io.emit('message', defaultMsg(defaultData));
    });

    socket.on('nickname', (nickname) => {
      users = users.map((user) => (user === guestRandom ? nickname : user));

      // para renderizar os nicknames
      io.emit('usersOnline', users);
    });
  });
};

module.exports = socketWebchat;
