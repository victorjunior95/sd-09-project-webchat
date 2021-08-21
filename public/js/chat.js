const socket = window.io();

const ONLINE_USERS = '#online-user';

const inputNickname = document.querySelector('#input-nickname');
const inputMessage = document.querySelector('#input-message');
const btnSend = document.querySelector('#btn-send');
const btnSave = document.querySelector('#btn-save');

btnSave.addEventListener('click', (e) => {
  e.preventDefault();
  const listOnlineUsers = document.querySelectorAll(ONLINE_USERS);
  socket.emit('changeNickName', {
    lastNickName: listOnlineUsers[0].innerText,
    newNickName: inputNickname.value,
  });
  listOnlineUsers[0].innerText = inputNickname.value;
  inputNickname.value = '';
  return false;
});

btnSend.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', {
    nickname: inputNickname.value,
    chatMessage: inputMessage.value,
  });
  inputNickname.value = '';
  inputMessage.value = '';
  return false;
});

const changeNickName = ({ lastNickName, newNickName }) => {
  const listOnlineUsers = document.querySelectorAll(ONLINE_USERS);

  for (let i = 0; i < listOnlineUsers.length; i += 1) {
    if (listOnlineUsers[i].innerText === lastNickName) listOnlineUsers[i].innerText = newNickName;
  }
};

const createMessage = (message) => {
  const ulMessages = document.querySelector('#ulMessages');
  const li = document.createElement('li');
  li.dataset.testid = 'message';
  li.innerText = message;
  ulMessages.appendChild(li);
};

const insertNickName = (nickName) => {
  const ulUsers = document.querySelector('#ulUsers');
  const li = document.createElement('li');
  li.dataset.testid = 'online-user';
  li.id = 'online-user';
  li.innerText = nickName;
  ulUsers.appendChild(li);
};

socket.on('message', (message) => createMessage(message));

socket.on('changeNickName', (nicksNames) => changeNickName(nicksNames));

socket.on('logout', (nickName) => {
  const ulUsers = document.querySelector('#ulUsers');
  const listOnlineUsers = document.querySelectorAll(ONLINE_USERS);

  for (let i = 0; i < listOnlineUsers.length; i += 1) {
    if (listOnlineUsers[i].innerText === nickName) ulUsers.removeChild(listOnlineUsers[i]);
  }
});

socket.on('refreshUsers', (nickName) => {
  const listOnlineUsers = document.querySelectorAll(ONLINE_USERS);
  let status = false;

  for (let i = 0; i < listOnlineUsers.length; i += 1) {
    if (listOnlineUsers[i].innerText === nickName) status = true;
  }

  if (!status) insertNickName(nickName);
});

socket.on('newUser', (nickName) => {
  insertNickName(nickName);
  const listOnlineUsers = document.querySelectorAll(ONLINE_USERS);

  socket.emit('nickname', listOnlineUsers[0].innerText);
});

socket.on('welcome', ({ nickname, messages }) => {
  insertNickName(nickname);
  messages.forEach((message) =>
    createMessage(`${message.timestamp} - ${message.nickname}: ${message.message}`));
  socket.emit('login', nickname);
});

window.onbeforeunload = () => {
  const listOnlineUsers = document.querySelectorAll(ONLINE_USERS);
  socket.emit('logout', listOnlineUsers[0].innerText);
};
