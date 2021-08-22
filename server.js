const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (_req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

require('./sockets/chat')(io);

app.use(express.static(`${__dirname}/public`));

server.listen(3000, () => {
  console.log('It\'s Alive!!!');
});
