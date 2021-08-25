const socket = window.io();
window.onbeforeunload = () => socket.disconnect(sessionStorage.nickname);

const DATA_TESTID = 'data-testid';
let nickname;
const renameNickname = (newNickname) => {
  nickname = newNickname;

  sessionStorage.setItem('nickname', nickname);
};

const form = document.querySelector('form');
const message = document.querySelector('#message');
const inputNickname = document.querySelector('#nickname');
const nicknameButton = document.querySelector('#nickname-button');
const messagesSent = document.querySelector('#messages');
const usersOnline = document.querySelector('#usersOnline');

const renderMessage = (msg) => {
  const div = document.createElement('div');
  div.innerText = msg;
  div.setAttribute(DATA_TESTID, 'message');
  messagesSent.appendChild(div);
};

const renderUsers = (user) => {
  const div = document.createElement('li');
  div.innerText = user;
  div.setAttribute(DATA_TESTID, 'online-user');
  usersOnline.appendChild(div);
};

nicknameButton.addEventListener('click', () => {
  renameNickname(inputNickname.value);

  socket.emit('nickname', sessionStorage.nickname);
});

socket.on('nickname', (guestRandom) => {
  renameNickname(guestRandom);

  socket.emit('nickname', sessionStorage.nickname);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  socket.emit('message', { chatMessage: message.value, nickname });
});

// Escuta a msg no formato string
socket.on('message', (data) => {
  renderMessage(data);
});

socket.on('usersOnline', (data) => {
  usersOnline.innerHTML = '';
  renderUsers(nickname);
  data.forEach((user) => user !== nickname && renderUsers(user));
});

socket.on('history', (data) => {
  data.forEach((msg) => {
    renderMessage(msg);
  });
});

// Escuta broadcast.emit
socket.on('offline', (data) => {
  usersOnline.innerHTML = '';
  data.map((user) => (renderUsers(user)));
});
