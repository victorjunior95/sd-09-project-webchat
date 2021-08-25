const express = require('express');
const path = require('path');

const pathFrontend = path.join(__dirname, 'public');

const app = express();

const serverSocket = require('http').createServer(app);
const io = require('socket.io')(serverSocket, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

require('./sockets/chatServer')(io);

const chatController = require('./controllers/webchat');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', chatController);
app.use(express.static(pathFrontend));

serverSocket.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
