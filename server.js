const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { PORT, SOCKET_PORT } = process.env;

// configuracao do socket.io
const socketIoServer = require('http').createServer();
const io = require('socket.io')(socketIoServer, {
  cors: {
    origin: 'socketIoServer://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', chatRoutes);

app.listen(PORT, () => console.log(`Server running... | port: ${PORT}`));

socketIoServer.listen(
  SOCKET_PORT,
  console.log(`Socket.io running... | port: ${SOCKET_PORT}`),
);
