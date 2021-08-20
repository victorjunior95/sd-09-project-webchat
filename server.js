const express = require('express');
const path = require('path');
require('dotenv').config();

const { SOCKET_PORT } = process.env || 3000;

const app = express();
// configuracao do socket.io
const socketIoServer = require('http').createServer(app);
const io = require('socket.io')(socketIoServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

require('./sockets/chat')(io);

const controllers = require('./controllers/chatController');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', controllers.getMessages);

socketIoServer.listen(SOCKET_PORT, () =>
  console.log(`Socket.io running... | port: ${SOCKET_PORT}`));
