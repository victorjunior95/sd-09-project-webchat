const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
} });
const { getAllMessages } = require('./models/chat');

require('./sockets/chat')(io);

app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'ejs');

app.get('/', async (_req, res) => {
  const allMessages = await getAllMessages();
  const messages = allMessages.map(({ message, nickname, timeStamp }) => 
  `${timeStamp} - ${nickname}: ${message}`);
  res.render('chat', { messages });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => console.log(`Online on PORT: ${PORT}`));