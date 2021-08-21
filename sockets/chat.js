const chatModel = require('../models/chatModel');

const newConnection = (io) => {
  io.emit('wellcome', 'Cheguei');
};

const createRandomName = (length) => {
  let result = '';
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    result += validChars.charAt(Math.floor(Math.random() * validChars.length));
  }

  return result;
};

const names = {};

const message = (socket, io) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const fullDate = new Date();
    const day = fullDate.getDate();
    const month = fullDate.getMonth();
    const year = fullDate.getFullYear();

    const hours = fullDate.getHours();
    const minutes = fullDate.getMinutes();

    const timestamp = `${day}-${month}-${year} ${hours}:${minutes}`;

    const usrMsg = `${timestamp} ${nickname}: ${chatMessage}`;

    chatModel.saveMsgs({ message: chatMessage, nickname, timestamp });

    io.emit('message', usrMsg);
  });
};

const msgHistory = (socket) => {
  socket.on('msgHistory', async () => {
    const getMesgs = await chatModel.getMesgs();

    socket.emit('getMesgs', getMesgs);
  });
};

const connectedList = (socket, io) => {
  socket.on('listNames', () => {
    names[socket.id] = createRandomName(16);

    io.emit('updateOnline', { names });
  });
};

const changeName = (socket, io) => {
  socket.on('changeName', (newNick) => {
    names[socket.id] = newNick;

    io.emit('updateOnline', { names });
  });
};

const disconnect = (socket, io) => {
  socket.on('disconnect', () => {
    delete names[socket.id];

    io.emit('updateOnline', { names });
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  newConnection(socket);
  message(socket, io);
  msgHistory(socket);
  changeName(socket, io);
  connectedList(socket, io);
  disconnect(socket, io);
});
