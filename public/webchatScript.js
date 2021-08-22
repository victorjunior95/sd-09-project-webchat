const socket = window.io();
let user;

const geraStringAleatoria = () => {
  let stringAleatoria = '';
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i += 1) {
    stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return stringAleatoria;
};

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages-content');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

const createUser = (message) => {
  const usersUl = document.querySelector('#users-content');
  const li = document.createElement('li');
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
  socket.emit('message', { chatMessage: messageInput.value, nickname: user });
});

socket.on('login', (name) => {
  const randomName = geraStringAleatoria();
  user = {
    socketid: name,
    randomName,
  };
  console.log(user.randomName);
  createUser(user.randomName);
});

socket.on('message', (newMessage) => {
  console.log(newMessage);
  createMessage(newMessage);
});
