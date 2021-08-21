// Faça seu código aqui
const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

require('./sockets/ping')(io);
require('./sockets/chat')(io);

app.use('/public', express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

http.listen(3000, () => console.log('Servidor rodando na porta 3000'));
