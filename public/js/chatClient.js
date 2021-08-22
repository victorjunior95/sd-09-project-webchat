const socket = window.io();

window.onload = () => socket.emit('newConnection');

const nicknameForm = document.querySelector('.nicknameForm');
const nicknameInput = document.querySelector('.nicknameInput');
// const nicknameButton = document.querySelector('.nicknameButton');
const nicknameList = document.querySelector('.nicknameList');
const userNickname = document.querySelector('.userNickname');

const chatForm = document.querySelector('.chatForm');
const chatInput = document.querySelector('.chatInput');
// const chatButton = document.querySelector('chatButton');
const messageList = document.querySelector('.messageList');

const createItemList = (content, list, dataTestId = '') => {
  const li = document.createElement('li');
  li.innerText = content;
  if (dataTestId !== '') li.setAttribute('data-testid', dataTestId);
  list.appendChild(li);
};

const createMessage = (message) => {
  createItemList(message, messageList, 'message');
};

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const chatMessage = chatInput.value;
  const nickname = userNickname.innerText;
  socket.emit('message', { chatMessage, nickname });
  chatInput.value = '';
});

nicknameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const newNickname = nicknameInput.value;
  const oldNickname = userNickname.innerText;
  userNickname.innerText = newNickname;
  socket.emit('newNickname', { newNickname, oldNickname });
  nicknameInput.value = '';
});

socket.on('user', (user) => {
  userNickname.innerText = user;
});

socket.on('onlineUsers', (users) => {
  nicknameList.innerHTML = '';
  users.forEach((user) => {
    if (user !== userNickname.innerText) createItemList(user, nicknameList);
  });
});

socket.on('message', (message) => createMessage(message));
