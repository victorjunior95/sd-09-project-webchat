const express = require('express');

const app = express();
const PORT = 3000;

const http = require('http').createServer(app);

http.listen(PORT, () => console.log('Servidor ouvindo na porta %d', PORT));

const io = require('socket.io')(http, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

io.on('connection', (socket) => {    
  socket.on('message', (message) => {
    const date = new Date();
    const fullDate = `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    io.emit('message', `${fullDate} ${time} - ${message.nickname}: ${message.chatMessage}`);
  });
});
