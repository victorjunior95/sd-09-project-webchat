const socket = window.io();

window.onload = () => {
  socket.emit('newUser');
};

/* by: JVRM e Ric */
const infosUser = document.querySelector('#chatUser');
const nickReceive = document.querySelector('#nickname-box');
const listName = document.querySelector('#nickname-list');

let userIdentification = '';

infosUser.addEventListener('submit', (event) => {
  event.preventDefault();
  const nickname = nickReceive.value;
  localStorage.setItem('nickname', nickname);

  userIdentification = nickname;
  socket.emit('changeName', nickname);
});

const chatInfos = document.querySelector('#chatForm');
const messageReceive = document.querySelector('#message-box');

chatInfos.addEventListener('submit', (event) => {
  event.preventDefault();
  const chatMessage = messageReceive.value;
  const nickname = userIdentification;
  socket.emit('message', { chatMessage, nickname });
  messageReceive.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
  return 0;
};

const addUser = async (user) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.className = user;
  li.innerText = user;
  listName.appendChild(li);
  return null;
};

socket.on('restoreChat', (messageList) => {
  if (!messageList) return 0;
  console.log(messageList);
  document.querySelector('#messages').innerHTML = '';
  messageList.map(({ message, nickname, timestamp }) => createMessage(
    `${timestamp} ${nickname}: ${message}`,
    ));
});

socket.on('message', (message) => createMessage(message));

socket.on('newUser', (userList) => {
  listName.innerHTML = '';
  userList.map((user) => addUser(user[1]));
  return 0;
});

socket.on('changeName', (userList) => {
  listName.innerHTML = '';
  userList.map((user) => addUser(user[1]));
});

socket.on('online', (userList) => {
  listName.innerHTML = '';
  const userId = userList[userList.length - 1];
  userList.pop();
  const newList = [userId, ...userList];
  newList.map((user) => addUser(user[1]));
  return 0;
});

socket.on('offline', (userList) => {
  listName.innerHTML = '';
  userList.map((user) => addUser(user[1]));
});
/* by: JVRM e Ric */