const express = require('express');
const ejs = require('ejs');
const cors = require('cors');

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

const webchatController = require('./controllers/Webchat');
const socketWebchat = require('./socket/Webchat');

app.use(cors());

socketWebchat(io);

// Path do arq. púb. (front-end) acessados pela app
app.use(express.static('views'));
// Configuração das views com HMTL
app.set('views', 'views');
// Configuração do template engine como HTML
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.get('/', webchatController.view);

server.listen(3000, console.log('listening on port 3000'));
