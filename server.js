const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  } });

const PORT = 3000;

let clients = [];

const { createMessage, messageHistory } = require('./models/chatModel.js'); 

const updateNickname = (socket) => {
  socket.on('updateNickname', (nickname) => {
    const position = clients.findIndex((client) => client.id === socket.id);
    clients[position].nickname = nickname;
    io.emit('handleNickname', clients);
  });
};

io.on('connection', async (socket) => {
  socket.on('handleNickname', (nickname) => {
    clients = [...clients, { id: socket.id, nickname }];
    io.emit('handleNickname', clients);
  });

  updateNickname(socket);

  const history = await messageHistory();
  socket.emit('history', history);
  socket.on('message', async ({ chatMessage, nickname }) => {
    const fullDate = moment(Date.now()).format('DD-MM-yyyy HH:mm:ss a');
    await createMessage(chatMessage, nickname, fullDate);
    const newMessage = `${fullDate} ${nickname} ${chatMessage}`;
    io.emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    clients = clients.filter((client) => client.id !== socket.id);
    io.emit('clientExit', clients);
  });
});

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

http.listen(PORT, () => console.log('App listening on PORT %s', PORT));
