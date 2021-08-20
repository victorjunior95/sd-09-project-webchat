const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const Message = require('./models/messages');

let loggedUsers = [];

const timeStamp = () => {
  const d = new Date();
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
};

const addInLoggedUsers = (userNick, userId) => {
  loggedUsers.push({
    userNick,
    userId,
  });
};

const updateNick = (message, userId) => {
  const { newNick } = message;
  const userLogged = loggedUsers.find((user) => user.userId === userId);
  const index = loggedUsers.indexOf(userLogged);
  loggedUsers[index] = { userNick: newNick, userId };
};

const removeInLoggedUsers = (userId) => {
  const logoutUser = loggedUsers.find((user) => user.userId === userId);
  loggedUsers = loggedUsers.filter((user) => user.userId !== userId);
  if (logoutUser) return logoutUser.userNick;
};

io.on('connection', (socket) => {
  socket.on('logged', async (message) => {
    socket.broadcast.emit('newUser', message.userName);
    const messages = await Message.getAll();
    socket.emit('logged', { loggedUsers, messages });
    addInLoggedUsers(message.userName, socket.id);
  });

  socket.on('changeNick', (message) => {
    updateNick(message, socket.id);
    socket.broadcast.emit('changeNick', message);
  });

  socket.on('disconnect', () => {
    const user = removeInLoggedUsers(socket.id);
    socket.broadcast.emit('logout', user);
  });

  socket.on('message', (message) => {
    io.emit('message', `${timeStamp()} - ${message.nickname}: ${message.chatMessage}`);
    Message.create(message.chatMessage, message.nickname, timeStamp());
  });
});

app.use(express.static(`${__dirname}/public`));

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
}); 