const express = require('express');
const moment = require('moment');

const app = express();

const serverSocket = require('http').createServer(app);
const io = require('socket.io')(serverSocket, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const chatController = require('./controllers/webchat');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', chatController);

io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id}`);

  socket.on('message', ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-YYYY HH:mm:ss A');
    const message = `${timestamp} - ${nickname}: ${chatMessage}`;
    console.log('user enviou uma msg');

    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('serverMessage', `Xiii! ${socket.id} acabou de se desconectar! :(`);
  });
});

serverSocket.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
