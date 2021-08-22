const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const connection = require('./models/connection');

async function saveMessage(message, nickname) {
    const conn = await connection();
    const messages = conn.collection('messages');
    messages.insertOne({ message, nickname, timestamp: new Date() });
}

function formatMessage(message, nickname, date) {
    const dateFormatted = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    const timeFormatted = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return `${dateFormatted} ${timeFormatted} ${nickname} ${message}`;
}

async function getMessages() {
    const conn = await connection();
    const messagesCollection = conn.collection('messages');
    const messages = await messagesCollection.find().toArray();
    return messages.map(({ message, nickname, timestamp }) =>
     formatMessage(message, nickname, timestamp));
}

io.on('connection', (socket) => {
    getMessages().then((messages) => {
        socket.emit('messages', messages);
    });
    socket.on('message', (data) => {
        const date = new Date();
        saveMessage(data.chatMessage, data.nickname);
        io.emit('message', formatMessage(data.chatMessage, data.nickname, date));
    });
});
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

http.listen(3000, () => console.log('server started'));

// Faça seu código aqui