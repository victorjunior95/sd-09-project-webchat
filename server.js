// Faça seu código aqui

const express = require('express');

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const messagesController = require('./controllers/messagesController');

require('./sockets/chat')(io);

app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', messagesController.getAll);

// app.get('/', (req, res) => {
//   res.sendFile(`${__dirname}/index.html`);
// });

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});