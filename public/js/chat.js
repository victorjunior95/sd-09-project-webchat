const socket = window.io();

const sendButton = document.querySelector('#sendButton');
const inputMessage = document.querySelector('#messageInput');
const newNickNameInput = document.querySelector('#nicknameInput');
const setNewNickButton = document.querySelector('#nickButton');
let nickname = '';

setNewNickButton.addEventListener('click', (e) => {
  e.preventDefault();
  nickname = newNickNameInput.value;
  newNickNameInput.value = '';
});

sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', ({ chatMessage: inputMessage.value, nickname }));
  inputMessage.value = '';
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));
socket.on('listUsers', (users) => {
  const listUl = document.querySelector('#listOnlineUsers');
  const li = document.createElement('li');
  users.forEach((user) => {
    li.innerText = user;
  });
  li.setAttribute('data-testid', 'online-user');
  listUl.appendChild(li);
});

window.onbeforeunload = () => {
  socket.disconnect();
};