const express = require('express');
const moment = require('moment');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(`${__dirname}/public`));

const chat = require('./models/chat');

let users = [];
const getUsers = () => users.map(({ nickname }) => nickname);

io.on('connect', async (socket) => {
  const randonNickname = socket.id.slice(0, 16);
  users.push({ socket, nickname: randonNickname });
  socket.emit('changeNickname', randonNickname); io.emit('allUsers', getUsers());
  socket.emit('chatMongoDB', await chat.getMessages());
  socket.on('message', async ({ nickname, chatMessage }) => {
    const timestamp = moment().format('DD-MM-yyyy HH:mm:ss A');
    const message = `${timestamp} - ${nickname}: ${chatMessage} \n`;
    await chat.createMessage({ message, timestamp: moment().toISOString(), nickname });
    io.emit('message', message);
  });
  socket.on('changeNickname', (payload) => {
    const findUser = users.find((user) => user.socket === socket); 
    findUser.nickname = payload; io.emit('allUsers', getUsers());
  });
  socket.on('disconnect', () => {
    users = users.filter((user) => user.socket !== socket);
    io.emit('allUsers', getUsers());
  });
});

app.use('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

server.listen(3000, () => console.log('Listening on port 3000'));
