const express = require('express');
const randomstring = require('randomstring');

const app = express();
const PORT = 3000;

const http = require('http').createServer(app);

http.listen(PORT, () => console.log('Servidor ouvindo na porta %d', PORT));

const io = require('socket.io')(http, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

const { getMessages, createMessage } = require('./controllers/chatController');

let users = [];

io.on('connection', async (socket) => {
  const onlineUser = { id: socket.id, nickname: randomstring.generate(16) };
  users.push(onlineUser); const msgs = await getMessages();
  socket.emit('onlineUser', onlineUser); io.emit('connectUser', { users, msgs });
  socket.on('message', async (message) => {
    const date = new Date();
    const fullDate = `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    io.emit('message', `${fullDate} ${time} - ${message.nickname}: ${message.chatMessage}`);
    await createMessage(message.chatMessage, message.nickname);
  });
  socket.on('nickname', (nickname) => {
    const cNickname = users.find((user) => user.id === socket.id);
    cNickname.nickname = nickname; io.emit('updateNickname', users);
  });
  socket.on('disconnect', () => {
    users = users.filter((user) => user.id !== socket.id);
    io.emit('disconnectClient', users);
  });
});

app.use(express.static('public'));
