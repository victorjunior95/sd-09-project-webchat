require('dotenv').config();
const express = require('express');

const app = express();
const http = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const controllers = require('./controllers');

require('./sockets/message')(io);

app.get('/', controllers.chat);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
