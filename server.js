const express = require('express');
const moment = require('moment');
const path = require('path');

const publics = path.join(__dirname, 'public');

const app = express();

const serverSocket = require('http').createServer(app);
const io = require('socket.io')(serverSocket, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const chatController = require('./controllers/webchat');
const generateNickname = require('./utils/generateNick');
const chatModel = require('./models/chatModel');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', chatController);
app.use(express.static(publics));

// const users = [];

io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id}`);

  const initNickname = generateNickname();
  // const userId = socket.id;

  socket.emit('initNick', initNickname);
  // users.push({ userId, initNickname });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-YYYY HH:mm:ss A');
    const message = `${timestamp} - ${nickname}: ${chatMessage}`;

    await chatModel.saveHistory({ nickname, chatMessage, timestamp });

    io.emit('message', message);
  });

  socket.on('customizeNick', (nickname) => {
    io.emit('customizeNick', nickname);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('serverMessage', `Xiii! ${socket.id} acabou de se desconectar! :(`);
  });
});

serverSocket.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});
