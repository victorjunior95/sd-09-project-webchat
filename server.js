const express = require('express');
const moment = require('moment');
// const cors = require('cors');

const app = express();
const serverSocket = require('http').createServer();

app.set('view engine', 'ejs');
app.set('views', './views');

const io = require('socket.io')(serverSocket, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id}`);

  socket.on('message', ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-YYYY HH:mm:ss A');
    const message = `${timestamp} - ${nickname}: ${chatMessage}`;

    io.emit(message);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('serverMessage', `Xiii! ${socket.id} acabou de se desconectar! :(`);
  });
});

app.get('/', (req, res) => res.render('index'));

serverSocket.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
