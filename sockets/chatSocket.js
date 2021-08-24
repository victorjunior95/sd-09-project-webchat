const moment = require('moment');
const ChatModel = require('../models/chatModel');

const allOnlineUsers = [];

const createTimestamp = moment().format('DD-MM-yyyy HH:mm:ss');

const getMessageFormat = async ({ chatMessage, nickname }) => {
  const timestamp = createTimestamp;
  await ChatModel.addMessage({ message: chatMessage, nickname, timestamp });
  return `${timestamp} - ${nickname}: ${chatMessage}`;
};

const getAllMessages = async (socket) => {
  const allMessages = await ChatModel.getAllMessages();
  const getAllMessagesFormat = allMessages.map(
    ({ timestamp, nickname, message }) => `${timestamp} - ${nickname}: ${message}`,
  );
  socket.emit('getAllMessages', getAllMessagesFormat);
};

const updateOnlineUsersList = (io) => {
  const allNicknames = allOnlineUsers.map((user) => user.nickname);

  io.emit('updateOnlineUsersList', allNicknames);
};

const chatConfig = async (io, socket) => {
  await getAllMessages(socket);
  socket.on('clientMessage', (dataMessage) => {
    const formatedMsg = getMessageFormat(dataMessage);
    io.emit('serverMessage', formatedMsg);
  });

  const newUserInfo = { nickname: socket.id.slice(0, 16), userId: socket.id };
  allOnlineUsers.push(newUserInfo);
  socket.emit('login', newUserInfo.nickname);
  updateOnlineUsersList(io);
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    chatConfig(io, socket);

    socket.on('updateNickname', (newNickname) => {
      const index = allOnlineUsers.findIndex((user) => user.userId === socket.id);
      allOnlineUsers[index].nickname = newNickname;
      updateOnlineUsersList(io);
    });
  });
};