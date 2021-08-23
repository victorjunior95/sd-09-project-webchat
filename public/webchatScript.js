const socket = window.io();

window.onbeforeunload = () => {
  socket.disconnect();
};

let localUser;

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages-content');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

const usersUl = document.querySelector('#users-content');

const createUser = (message) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.innerText = message;
  usersUl.appendChild(li);
};

const nicknameForm = document.querySelector('#nickname-form');
const nicknameInput = document.querySelector('#nickname-input-id');

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('ok');
  socket.emit('clientNickname', nicknameInput.value);
  nicknameInput.value = '';
  return false;
});

const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input-id');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: messageInput.value, nickname: localUser.nickname });
});

socket.on('setUser', (user) => {
  localUser = user;
});

socket.on('login', (users) => {
  usersUl.innerHTML = '';
  users[0].users.forEach((item) => createUser(item.nickname));
});

socket.on('message', (newMessage) => {
  console.log(newMessage);
  createMessage(newMessage);
});

socket.on('updateListOfUsers', (users) => {
  usersUl.innerHTML = '';
  users[0].users.forEach((item) => createUser(item.nickname));
});
