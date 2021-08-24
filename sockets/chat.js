const moment = require('moment');
const Chat = require('../models/chat');

const users = [];

const updateNickname = (nickname, users, socket) => {
  users.forEach((user, index) => {
    if (user.id === socket.id) users[index].nickname = nickname;
  });
  return users;
};

const filterUsers = (users, socket) => {
  users.filter((user, index) => {
    if (user.id === socket.id) {
      users.splice(index, 1);
    }
  });
  return users;
};

const createMessage = (users, socket, messageObj) => {
  const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
  let nickname;
  const { chatMessage } = messageObj;
  const user = users.find((user) => user.id === socket.id);

  if (user && user.nickname !== messageObj.nickname) {
    nickname = user.nickname;
  } else {
    nickname = messageObj.nickname;
  }

  Chat.setData(timestamp, nickname, chatMessage);
  return `${timestamp} ${nickname}: ${chatMessage}`;

};

module.exports = (io) => io.on('connection', async (socket) => {
  const { id } = socket;
  
  const user = {
     id,
     nickname: id.slice(0, -4),
  };

  socket.on('updateNickname', (nickname) => {
    const updatedUsers = updateNickname(nickname, users, socket);
    // users.forEach((user, index) => {
    //   if (user.id === socket.id) {
    //     users[index].nickname = nickname;
    //   }
    // });
    io.emit('onlineUsers', updatedUsers);
  });

  socket.on('updateOnlineUsers', () => {
    users.push(user);
    io.emit('onlineUsers', users);
  });

  socket.on('disconnect', () => {
    const filteredUsers = filterUsers(users, socket);
    // users.filter((user, index) => {
    //   if (user.id === socket.id) {
    //     users.splice(index, 1);
    //   }
    // });
    io.emit('onlineUsers', filteredUsers);
  });

  socket.on('message', (messageObj) => {
    // const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
    // const { chatMessage } = messageObj;
    // let nickname;
    // // const { nickname, chatMessage } = messageObj;
    // const user = users.find((user) => user.id === socket.id);

    // if (user && user.nickname !== messageObj.nickname) {
    //   nickname = user.nickname;
    // } else {
    //   nickname = messageObj.nickname;
    // }

    // Chat.setData(timestamp, nickname, chatMessage);
    // io.emit('message', `${timestamp} ${nickname}: ${chatMessage}`);
    io.emit('message', createMessage(users, socket, messageObj));
    // io.emit('message', {timestamp, nickname, chatMessage});
  });

  const getChatMessages = await Chat.getAll();
  io.emit('retryMessages', getChatMessages);
});
