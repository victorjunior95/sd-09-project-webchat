const moment = require('moment');

const ChatModel = require('../models/chatModel');

const allOnlineUsers = [];

const getTimestamp = moment().format('DD-MM-yyyy HH:mm:ss');

const getMessageFormat = async ({ chatMessage, nickname }) => {
  const timestamp = getTimestamp;
  await ChatModel.addNewMessage({ message: chatMessage, nickname, timestamp });
  return `${timestamp} - ${nickname}: ${chatMessage}`;
};

const updateOnlineUsersList = (io) => {
  const allNicknames = allOnlineUsers.map((user) => user.nickname);
  io.emit('updateOnlineUsersList', allNicknames);
};

const getAllMessages = async (socket) => {
  const allMessages = await ChatModel.getAllMessages();
  const getMessagesFormat = allMessages.map(
    ({ timestamp, nickname, message }) => `${timestamp} - ${nickname}: ${message}`,
  );
  socket.emit('getAllMessages', getMessagesFormat);
};

const chatConfig = async (io, socket) => {
  await getAllMessages(socket);
  socket.on('message', async (dataMessage) => {
    const formatedMsg = await getMessageFormat(dataMessage);
    io.emit('message', formatedMsg);
  });

  const newUserInfo = { nickname: socket.id.slice(0, 16), userId: socket.id };
  allOnlineUsers.push(newUserInfo);
  socket.emit('login', newUserInfo.nickname);
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

    socket.on('disconnect', () => {
      const index = allOnlineUsers.findIndex((user) => user.userId === socket.id);
      allOnlineUsers.splice(index, 1);
      updateOnlineUsersList(io);
    });
  });
};