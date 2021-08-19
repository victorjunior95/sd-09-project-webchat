const moment = require('moment');

require('dotenv').config();
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { PORT } = process.env || 3000;
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '/index.html'));

io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on('message', (messageObj) => {
    const message = `${moment()
      .format('DD-MM-yyyy HH:mm:ss')} - ${messageObj.nickname}: ${messageObj.chatMessage}`;
    io.emit('message', message);
  });
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

server.listen(PORT, console.log(`Ouvindo a PORT: ${PORT}`));