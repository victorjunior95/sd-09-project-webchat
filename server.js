require('dotenv').config();

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();

// criando o websocket
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});

// informando a pasta de origem dos arquivos frontend e qual engine usada
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// rendenrizando o frontend
app.use('/', (req, res) => {
  res.render('index.ejs');
});

// codigo do socket
require('./sockets/chat')(io);

server.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
