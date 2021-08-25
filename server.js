const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const moment = require('moment');

const { insertMessage } = require('./models/chat');
const { searchAllMessages } = require('./models/chat');

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

let users = [];

io.on('connection', async (socket) => {
  let user = socket.id.slice(0, 16);
  users.push(user);
  socket.emit('userOnline', user);

  const messages = await searchAllMessages();
  socket.emit('history', messages);

  socket.on('newNick', (nickname) => { 
    users = users.map((el) => (el === user ? nickname : el));
    user = nickname;
    io.emit('allUsers', users);
  });
  // LTS pega o horário no formato 2:35:09 PM
  const date = moment().format('DD-MM-yyyy LTS');

  socket.on('message', ({ chatMessage, nickname }) => {
    // 09-10-2020 2:35:09 PM - Joel: Olá meu caros amigos!
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
    insertMessage({ chatMessage, nickname, timestamp: date });
  });

  socket.on('disconnect', () => {
    users = users.filter((u) => u !== user); io.emit('allUsers', users);
    // console.log(users);
  });
});

app.use('/', (req, res) => {
  res.render('index');
});

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});