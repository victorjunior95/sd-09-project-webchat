const moment = require('moment');

const allOnlineUsers = [];

const getTimestamp = moment().format('DD-MM-yyyy HH:mm:ss');

const getMessageFormat = async ({ chatMessage, nickname }) => {
  const timestamp = getTimestamp;
  return `${timestamp} - ${nickname}: ${chatMessage}`;
};

const updateOnlineUsersList = (io) => {
  const allNicknames = allOnlineUsers.map((user) => user.nickname);
  io.emit('updateOnlineUsersList', allNicknames);
};

const chatConfig = async (io, socket) => {
  socket.on('message', async (dataMessage) => {
    const formatedMsg = await getMessageFormat(dataMessage);
    io.emit('message', formatedMsg);
  });

  const newUserInfo = { nickname: socket.id.slice(0, 16), userId: socket.id };
  allOnlineUsers.push(newUserInfo);
  io.emit('login', newUserInfo.nickname);
  updateOnlineUsersList(io);
};

module.exports = (io) => {
  io.on('connection', async (socket) => {
    await chatConfig(io, socket);

    socket.on('updateNickname', (newNickname) => {
      const index = allOnlineUsers.findIndex((user) => user.userId === socket.id);
      allOnlineUsers[index].nickname = newNickname;
      updateOnlineUsersList(io);
    });
  });
};