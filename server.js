const express = require('express');
const { join } = require('path');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http,
  {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

require('./sockets/server-messages')(io);
require('./sockets/server-names')(io);

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(join(__dirname, 'public')));

app.use('/', (_req, res) => {
  res.render('index.html');
});

http.listen(PORT, () => {
  console.log('O Pai tá ON!!');
});
