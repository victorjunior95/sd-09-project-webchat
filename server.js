require('dotenv').config();
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { PORT } = process.env;

io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id} `);
});

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '/index.html'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

server.listen(PORT, console.log(`Ouvindo a PORT: ${PORT}`));