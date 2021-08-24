const express = require('express');
const ejs = require('ejs');
const cors = require('cors');
const moment = require('moment'); // lib de data e tempo

const app = express();
// Protocolo HTTP
const server = require('http').createServer(app);
// Protocolo WSS (p/ websocket)
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

// Path do arq. púb. (front-end) acessados pela app
app.use(express.static('views'));
// Configuração das views com HMTL
app.set('views', 'views');
// Configuração do template engine como HTML
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('Webchat');
});

// Array de msg (substituir pelo DB)
const messages = [];
console.log(messages);
// Array de users online
let users = [];

// Conexão do client com o nosso server (socket.io)
  // cada socket é um client que se conecta
io.on('connection', (socket) => {
  const guestRandom = socket.id.slice(0, 16);
  users.push(guestRandom);
  socket.emit('nickname', guestRandom);

  // Escuta o evento message do front-end
    // data é um obj { chatMessage, nickname }
  socket.on('message', (data) => {
    const timeStamp = moment().format('DD-MM-yyyy HH:mm:ss A');

    const defaultMsg = (obj) => `${timeStamp} - ${obj.nickname}: ${obj.chatMessage}`;

    // recebo data.nickname
    messages.push(data);

    // para renderizar as msg
    io.emit('message', defaultMsg(data));
  });

  socket.on('nickname', (nickname) => {
    users = users.map((user) => {
      if (user === guestRandom) return nickname;
      return user;
    });

    // para renderizar os nicknames
    io.emit('usersOnline', users);
  });
});

server.listen(3000, console.log('listening on port 3000'));
