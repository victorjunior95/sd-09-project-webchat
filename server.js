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

const users = [];

io.on('connection', async (socket) => {    
  users.push(randomstring.generate(16));
  const msgs = await getMessages();
  socket.emit('connectUser', { users, msgs });
  socket.on('message', async (message) => {
    const date = new Date();
    const fullDate = `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    io.emit('message', `${fullDate} ${time} - ${message.nickname}: ${message.chatMessage}`);
    await createMessage(message.chatMessage, message.nickname);
  });
});

app.use(express.static('public'));
