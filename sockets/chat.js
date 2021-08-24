const moment = require('moment');

const Chat = require('../models/chat');

const getChatMessages = async () => {
  const getAllMessages = await Chat.getAll();
  console.log(getAllMessages);
  return getAllMessages;
};

const users = [];

const updateNickname = (nickname, usersList, socket) => {
  const updatedUsers = usersList;
  usersList.forEach((user, index) => {
    if (user.id === socket.id) updatedUsers[index].nickname = nickname;
  });
  return updatedUsers;
};

const filterUsers = (usersList, socket) => {
  usersList.filter((user, index) => {
    if (user.id === socket.id) {
      usersList.splice(index, 1);
    }
    return false;
  });
  return usersList;
};

const createMessage = (usersList, socket, messageObj) => {
  const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
  let nickname;
  const { chatMessage } = messageObj;
  const findUser = usersList.find((user) => user.id === socket.id);

  if (findUser && findUser.nickname !== messageObj.nickname) {
    nickname = findUser.nickname;
  } else {
    nickname = messageObj.nickname;
  }

  Chat.setData(timestamp, nickname, chatMessage);
  return `${timestamp} ${nickname}: ${chatMessage}`;
};

module.exports = (io) => io.on('connection', async (socket) => {
  const { id } = socket;
  const user = { id, nickname: id.slice(0, -4) };

  socket.on('updateNickname', (nickname) => {
    const updatedUsers = updateNickname(nickname, users, socket);
    io.emit('onlineUsers', updatedUsers);
  });
  
  socket.on('updateOnlineUsers', () => {
    users.push(user);
    io.emit('onlineUsers', users);
  });
  
  socket.on('disconnect', () => {
    const filteredUsers = filterUsers(users, socket);
    io.emit('onlineUsers', filteredUsers);
  });
  
  socket.on('message', (messageObj) => {
    io.emit('message', createMessage(users, socket, messageObj));
  });

  io.emit('retryMessages', await getChatMessages());
});
