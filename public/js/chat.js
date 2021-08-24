const socket = window.io();

const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const messagesList = document.querySelector('#messages');
const usersList = document.querySelector('#users-list');
const nicknameForm = document.querySelector('#nickname-form');
const nicknameInput = document.querySelector('#nickname-input');

let nickname = null;

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = messageInput.value;
  socket.emit('clientMessage', { chatMessage, nickname });
  messageInput.value = '';
});

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const updatedNickname = nicknameInput.value;
  nickname = updatedNickname;
  socket.emit('updateNickname', nickname);
  nicknameInput.value = '';
});

const createMessage = (message) => {
  const newMessage = document.createElement('li');
  newMessage.setAttribute('data-testid', 'message');
  newMessage.innerText = message;
  messagesList.appendChild(newMessage);
};

const createUser = (newUserInfo) => {
  const newUser = document.createElement('li');
  newUser.setAttribute('data-testid', 'online-user');
  newUser.innerText = newUserInfo;
  usersList.appendChild(newUser);
};

socket.on('serverMessage', (message) => createMessage(message));
socket.on('login', (newUserInfo) => {
  nickname = newUserInfo;
  createUser(nickname);
});

socket.on('updateOnlineUsersList', (onlineUsersList) => {
  usersList.innerHTML = '';
  onlineUsersList.forEach((user) => {
    if (user !== nickname) {
      createUser(user);
    }
  });
});
