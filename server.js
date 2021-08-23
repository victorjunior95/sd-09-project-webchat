const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  } });
  
const userModel = require('./models/userRequests');

app.use(express.static(path.join(__dirname, '/public')));

require('./sockets/login')(io);
require('./sockets/message')(io);
require('./sockets/changeName')(io);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

http.listen(PORT, async () => {
  console.log('Servidor ouvindo na porta 3000');
  await userModel.clearDb();
});
