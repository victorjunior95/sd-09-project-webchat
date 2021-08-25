const express = require('express');
const path = require('path');

const app = express();
const cors = require('cors');

const server = require('http').createServer(app); // cria o server
const io = require('socket.io')(server, { // estancia o io
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  },
});

require('./sockets/webChatSocket')(io);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());

app.get('/', (_req, res) => res.render('chat')); // renderiza o chat com o metodo get

server.listen(3000, () => { // server criado e escutando na porta 3000
  console.log('Server is up on port 3000');
});