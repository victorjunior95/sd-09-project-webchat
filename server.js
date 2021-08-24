const express = require('express');
const moment = require('moment');

const app = express();

const serverSocket = require('http').createServer(app);
const io = require('socket.io')(serverSocket, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const chatController = require('./controllers/webchat');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', chatController);

// função para geração de nickname aleatório que encontrei no link:
// https://qastack.com.br/programming/1349404/generate-random-string-characters-in-javascript
// onde fiz algumas modificações depois de entender o algoritmo.
const generateNickname = () => {
  let nickname = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 16; i += 1) {
    nickname += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return nickname;
};

io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id}`);

  const initNickname = generateNickname();

  socket.emit('initNick', initNickname);

  socket.on('message', ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-YYYY HH:mm:ss A');
    const message = `${timestamp} - ${nickname}: ${chatMessage}`;

    io.emit('message', message);
  });

  socket.on('customizeNick', (nickname) => {
    console.log(nickname);
    io.emit('customizeNick', nickname);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('serverMessage', `Xiii! ${socket.id} acabou de se desconectar! :(`);
  });
});

serverSocket.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
