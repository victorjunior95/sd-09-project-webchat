const moment = require('moment');
const { saveMsg, getMsg } = require('../models/chat');

let onlineUsers = [];

const currentDate = () => (
  moment().format('DD-MM-yyyy h:mm:ss A')
  );

  const makeUser = (id) => {
    const user = {
      nickname: `user-${(id).slice(-11)}`,
      id,
    };
    return user;
  };

  const makeMessage = (nickname, chatMessage) => {
    const message = `${currentDate()} - ${nickname}: ${chatMessage}`;
    const document = {
      message: chatMessage,
      nickname,
      timestamp: currentDate(),
    };
    console.log(document.timestamp);
    return { message, document };
  };

  const filter = (userToChange) => {
    onlineUsers.filter((element) => {
      if (element.id === userToChange.id) {
        const index = onlineUsers.indexOf(element);
        onlineUsers[index].nickname = userToChange.nickname;
      }
      return true;
    });
  };

let msgHistory = [];

  module.exports = (io) => io.on('connection', async (socket) => {
    msgHistory = await getMsg(); socket.emit('msgHistory', msgHistory);

    const user = makeUser(socket.id);
    onlineUsers.push(user);
    io.emit('userConnected', user);
    io.emit('usersOnline', onlineUsers);
  socket.on('newNickName', (userToChange) => {
    filter(userToChange); io.emit('nickNameChanged', onlineUsers);
  });

  socket.on('disconnect', () => {
    getMsg().then((content) => { msgHistory = content; return true; });
    onlineUsers = onlineUsers.filter((element) => element.id !== socket.id);
    socket.broadcast.emit('usersOnline', onlineUsers);
  });

  socket.on('message', ({ chatMessage, nickname }) => {
    const { message, document } = makeMessage(nickname, chatMessage);
    io.emit('message', message);
    saveMsg(document);
  });
});
