const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
const {
  fromDb,
  insertOne,
} = require('./models/midwaresFunction'); 
// const { promiseImpl } = require('ejs');

const PORT = 3000;
const time = new Date();
const timeLocal = time.toLocaleString('pt-BR').replace(' ', '/').split('/').join('-');
let online = [];

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use('/', (_req, res) => {
res.render('index.html');
});

// eslint-disable-next-line max-lines-per-function
io.on('connection', async (socket) => {
  // console.log(`socket conectado com o ID: ${socket.id}`);
  const message = await fromDb();
  // gerando nick para o req2
  online.push(socket.id.slice(0, 16)); console.log('online', online); io.emit('sendonline', online);
  // enviando historico de mensagens ao front.
  socket.emit('previousmessage', message);

  // esperando evento message in
  socket.on('message', ({ chatMessage, nickname }) => { 
    const payload = `${timeLocal} - ${nickname}: ${chatMessage}`;
    const objmess = { timestamp: timeLocal, nickname, message: chatMessage };
    insertOne(objmess); io.emit('message', payload);
  });
    
  socket.on('nickchanged', ({ old, neo }) => { 
    online.forEach((e, i) => { if (e === old) { online[i] = neo; } });
      socket.broadcast.emit('changnick', { neo, old });
    });
  
  socket.on('disconnect', (motivo) => {
    const sliced = socket.id.slice(0, 16); const ativo = online.filter((e) => e !== sliced);
    online = ativo; if (motivo === 'transport error') { online = []; }
    console.log('saiu', sliced, 'motivo da saida: ', motivo, 'online ao sair', online);
    io.emit('userexit', online); 
  });
});

  // a porta deve ser atribuida por process.env?
server.listen(PORT, () => console.log('Express escutando na porta 3000'));
