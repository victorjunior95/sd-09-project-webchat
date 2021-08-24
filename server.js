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

// Conexão do client com o nosso server (socket.io)
io.on('connection', (socket) => {
  // Para gerar nickname
  const guest = socket.id.slice(0, 16);
  socket.emit('nickname', guest);
  // cada socket é um client que se conecta

  // Escuta o evento message do front-end
  socket.on('message', (data) => {
    const timeStamp = moment().format('DD-MM-yyyy HH:mm:ss A');

    const defaultMsg = `${timeStamp} - ${data.nickname}: ${data.chatMessage}`;

    messages.push(data);

    io.emit('message', defaultMsg);
  });
});

server.listen(3000, console.log('listening on port 3000'));
