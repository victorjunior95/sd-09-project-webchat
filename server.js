const moment = require('moment');

require('dotenv').config();
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { PORT } = process.env || 3000;

let usersOnline = [];

// eslint-disable-next-line max-lines-per-function
io.on('connection', (socket) => {
  socket.on('sendUser', (nickname) => {
    usersOnline.push({
      id: socket.id,
      nickname,
    });
    io.emit('login', usersOnline);
  });

  socket.on('updateNickname', (newNickname) => {
    usersOnline = usersOnline.map((user) => {
      if (user.id === socket.id) {
        return {
          id: socket.id,
          nickname: newNickname,
        };
      }
      return user;
    });

    io.emit('login', usersOnline);
  });

  socket.on('message', (messageObj) => {
    const message = `${moment()
      .format('DD-MM-yyyy HH:mm:ss')} - ${messageObj.nickname}: ${messageObj.chatMessage}`;
    io.emit('message', message);
  });
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

server.listen(PORT, console.log(`Ouvindo a PORT: ${PORT}`));