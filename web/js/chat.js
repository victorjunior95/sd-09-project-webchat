const socket = window.io();

window.onload = () => {
  socket.emit('newUser');
};
// FEITO COM A TRINCA DE 9 E WAR ROOM JRVM / INSTRUTORES
const userFormData = document.querySelector('#chatUser');
const nickName = document.querySelector('#nickname-box');
const nameList = document.querySelector('#nickname-list');

let userName = '';

userFormData.addEventListener('submit', (event) => {
  event.preventDefault();
  const nickname = nickName.value;
  localStorage.setItem('nickname', nickname);

  userName = nickname;
  socket.emit('changeName', nickname);
});

const formChat = document.querySelector('#chatForm');
const inputMessage = document.querySelector('#message-box');

formChat.addEventListener('submit', (event) => {
  event.preventDefault();
  const chatMessage = inputMessage.value;
  const nickname = userName;
  socket.emit('message', { chatMessage, nickname });
  inputMessage.value = '';
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
  nameList.appendChild(li);
  return null;
};
// FEITO COM A TRINCA DE 9 E WAR ROOM JRVM / INSTRUTORES
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
  nameList.innerHTML = '';
  userList.map((user) => addUser(user[1]));
  return 0;
});

socket.on('changeName', (userList) => {
  nameList.innerHTML = '';
  userList.map((user) => addUser(user[1]));
});

socket.on('online', (userList) => {
  nameList.innerHTML = '';
  const userId = userList[userList.length - 1];
  userList.pop();
  const newList = [userId, ...userList];
  newList.map((user) => addUser(user[1]));
  return 0;
});

socket.on('offline', (userList) => {
  nameList.innerHTML = '';
  userList.map((user) => addUser(user[1]));
});
