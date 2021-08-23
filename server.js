const express = require('express');

const dateFormat = require('dateformat');
const randomNick = require('random-character');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { addChatMessage } = require('./models/chatMessageModel');
const { getChatMessages } = require('./controllers/chatController');

const PORT = 3000;

const onlineUsers = {};
const date = dateFormat(new Date(), 'dd-mm-yyyy h:MM:ss TT');

io.on('connection', (client) => {  
  onlineUsers[client.id] = `User_${randomNick.randomChar(11)}`;

  client.emit('currentUser', onlineUsers[client.id]);

  client.on('message', ({ nickname, chatMessage }) => {
    addChatMessage({ message: chatMessage, nickname, timestamp: date });
    const newMessage = `${date} - ${nickname}: ${chatMessage}`;

    io.emit('message', newMessage);
  });

  io.emit('userNickname', Object.values(onlineUsers));

  client.on('changeNick', (nickname) => {
    Object.values(onlineUsers).filter((e) => e !== onlineUsers[client.id]);
    onlineUsers[client.id] = nickname;
    client.emit('currentUser', onlineUsers[client.id]);
    io.emit('userNickname', Object.values(onlineUsers));
  });

  client.on('disconnect', () => {
    delete onlineUsers[client.id];
    io.emit('userDisconnect', Object.values(onlineUsers));
  });
});

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.get('/messages', getChatMessages);

http.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
