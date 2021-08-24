require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

app.use(express.static(`${__dirname}/public`));

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

require('./sockets/chat')(io);

app.use(cors());
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');
app.set('views', './public');
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.render(`${__dirname}/index.html`);
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Conectado na porta ${PORT}`);
});
