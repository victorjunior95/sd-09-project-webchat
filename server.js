const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});
const { getMsgControl } = require('./controllers/chat');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.get('/history', getMsgControl);

io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id} `);
});

require('./sockets/chat')(io);

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});