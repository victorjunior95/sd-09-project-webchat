const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    socket.on('message', (data) => {
        const date = new Date();
        const dateFormatted = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
        const timeFormatted = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        io.emit('message',
         `${dateFormatted} ${timeFormatted} ${data.nickname} ${data.chatMessage}`);
    });
});
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

http.listen(3000, () => console.log('server started'));

// Faça seu código aqui