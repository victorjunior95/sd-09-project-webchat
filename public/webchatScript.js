const socket = window.io();
let user;

const createMessage = (message, form) => {
  const messagesUl = document.querySelector(`#${form}`);
  const li = document.createElement('li');
  li.innerText = message;
  messagesUl.appendChild(li);
};

const nicknameForm = document.querySelector('#nickname-form');
const nicknameInput = document.querySelector('#nickname-input-id');

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('clientNickname', nicknameInput.value);
  nicknameInput.value = '';
  return false;
});

const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input-id');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: messageInput.value, nickname: user });
});

socket.on('login', (name) => {
  user = name;
  createMessage(name, 'users-content');
});

socket.on('message', (newMessage) => {
  console.log(newMessage);
  createMessage(newMessage, 'messages-content');
});
