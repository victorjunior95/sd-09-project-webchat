const moment = require('moment');

require('dotenv').config();
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { insertMessage, findMessage } = require('./models/webchat');

const { PORT } = process.env || 3000;

let usersOnline = [];
const data = findMessage();
const userDisconn = (array, userId) => {
  array.forEach((item, index, object) => {
    console.log(item.nickname);
    console.log(userId);
    if (item.id === userId) object.splice(index, 1);
  });
  return array;
};

io.on('connection', async (socket) => {
  socket.on('sendUser', (nickname) => {
    usersOnline.push({ id: socket.id, nickname }); io.emit('login', usersOnline);
  });

  socket.on('updateNickname', (newNickname) => {
    usersOnline = usersOnline
      .map((user) => (user.id === socket.id ? { id: socket.id, nickname: newNickname } : user));
    io.emit('login', usersOnline);
  });

  socket.on('message', async (messageObj) => {
    const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
    await insertMessage({ ...messageObj, timestamp });
    io.emit('message', `${timestamp} - ${messageObj.nickname}: ${messageObj.chatMessage}`);
  });

  socket.emit('findMessages', await data);

  socket.on('disconnect', () => {
    userDisconn(usersOnline, socket.id);
    io.emit('login', usersOnline);
  });
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

server.listen(PORT, console.log(`Ouvindo a PORT: ${PORT}`));