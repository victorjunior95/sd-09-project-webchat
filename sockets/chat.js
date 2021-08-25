const getDatetimeStr = require('../utils/getDatetimeStr');

const MESSAGE_EVENT = 'message';
const SET_NICKNAME_EVENT = 'setNickname';
const ONLINE_USERS_EVENT = 'onlineUsers';
const DISCONNECT_EVENT = 'disconnect';

let onlineUsers = [];

const sendToAllClients = (io, event, content) => io.emit(event, content);

const sendToThisClient = (socket, event, content) => socket.emit(event, content);

const sendToOtherClients = (socket, event, content) => socket.broadcast.emit(event, content);

const startChatClient = (io) => (socket) => {
  let clientNickname = socket.id.toString().slice(0, 16);
  onlineUsers.push(clientNickname);
  console.log('user', clientNickname);
  console.log('users', onlineUsers);

  sendToThisClient(socket, SET_NICKNAME_EVENT, clientNickname);
  sendToAllClients(io, ONLINE_USERS_EVENT, onlineUsers);
  
  socket.on(SET_NICKNAME_EVENT, (newNickname) => {
    io.emit(MESSAGE_EVENT, `${clientNickname} mudou seu nick para ${newNickname}`);
    onlineUsers = onlineUsers
    .map((nickname) => ((nickname === clientNickname) ? newNickname : nickname));
    clientNickname = newNickname;
    sendToAllClients(io, ONLINE_USERS_EVENT, onlineUsers);
  });

  socket.on(MESSAGE_EVENT, ({ nickname, chatMessage }) => {
    const datetimeStr = getDatetimeStr();
    const messageStr = `${datetimeStr} - ${nickname}: ${chatMessage}`;
    sendToAllClients(io, MESSAGE_EVENT, messageStr);
  });
  
  socket.on(DISCONNECT_EVENT, () => {
    socket.broadcast.emit(MESSAGE_EVENT, `${clientNickname} deixou a sala`);
    onlineUsers = onlineUsers.filter((user) => user !== clientNickname);
    sendToAllClients(io, ONLINE_USERS_EVENT, onlineUsers);
  });
};

module.exports = (io) => io.on('connection', startChatClient(io));
