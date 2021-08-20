const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => console.log(`Online on PORT: ${PORT}`));