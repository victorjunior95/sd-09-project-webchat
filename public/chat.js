const socket = window.io();

const handleNick = document.getElementById('nickname-button');
const newNick = document.getElementById('nickname-box');
const usersList = document.getElementById('users-list');
const handleMessage = document.getElementById('send-button');
const messageBox = document.getElementById('message-box');
const messagesUl = document.getElementById('messages-list');

handleNick.addEventListener('click', () => {
  socket.emit('customizeNick', newNick.value);
});

socket.on('customizeNick', (nickname) => {
  usersList.firstElementChild.innerText = nickname;
});

handleMessage.addEventListener('click', (e) => {
  e.preventDefault();
  const chatMessage = messageBox.value;
  const nickname = document.getElementById('users-list').firstElementChild.innerText;

  socket.emit('message', { chatMessage, nickname });

  messageBox.value = '';
  messageBox.focus();
});

socket.on('initNick', (nickname) => {
  const newLi = document.createElement('li');
  newLi.setAttribute('data-testid', 'online-user');
  usersList.appendChild(newLi).innerText = nickname;
});

const createMessage = (message) => {
  const newLi = document.createElement('li');
  newLi.setAttribute('data-testid', 'message');
  newLi.innerText = message;
  messagesUl.appendChild(newLi);
};

socket.on('message', (message) => createMessage(message));
