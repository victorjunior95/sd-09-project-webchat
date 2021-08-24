require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');
const http = require('http');

const app = express();
const socketServer = http.createServer(app);

const io = require('socket.io')(socketServer, {
  cors: 'http://localhost:3000',
  methods: ['GET', 'POST'],
});

app.use(express.static(path.join(__dirname, '/public/')));

app.use(cors());

require('./sockets')(io);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/view.html')));

socketServer.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});