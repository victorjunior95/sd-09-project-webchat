// BACK-END
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const moment = require('moment');

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id} `);
  // LTS pega o horário no formato 2:35:09 PM
  const date = moment().format('DD-MM-yyyy LTS');

  /* Escuta o evento do client */
  socket.on('message', ({ chatMessage, nickname }) => {
    // 09-10-2020 2:35:09 PM - Joel: Olá meu caros amigos!
    /* Devolve um evento para o client */
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
  });
});

app.use('/', (req, res) => {
  res.render('index');
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});