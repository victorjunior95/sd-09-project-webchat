const express = require('express');
const generateRandomAnimalName = require('random-animal-name-generator');

const app = express();
const http = require('http').createServer(app);
const path = require('path');

const dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(dirname, '/public')));

app.set('view engine', 'ejs');
app.set('views', './views');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const Users = require('./controllers/users');
const Messages = require('./controllers/messages');

const connection = require('./messages/connection.js');
const disconnect = require('./messages/disconnect.js');
const message = require('./messages/message.js');
const nickname = require('./messages/nickname.js');

connection(io, Users);
disconnect(io);
message(io);
nickname(io);

app.get('/', async (req, res) => {
  const users = await Users.find();
  const oldMessages = await Messages.find();
  const animal = await generateRandomAnimalName().split(' ')[1];
  const newNickname = `${animal}-anonymous`.split('', 16).join('');
  if (!users) {
    connection(io, Users);
  }
  return res.status(200).render('index', { users, messages: oldMessages, newNickname });
});

http.listen(3000, () => { console.log('ouvindo na porta 3000'); });
