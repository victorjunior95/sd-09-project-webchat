require('dotenv').config();

const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

const { PORT } = process.env;

const io = require('socket.io')(http, { 
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

require('./sockets/chat')(io);

app.use(express.static(`${__dirname}/public`));

app.use(cors());

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/chat.html`);
});

http.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
