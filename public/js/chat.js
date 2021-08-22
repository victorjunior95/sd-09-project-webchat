const socket = window.io();

// const users = ['blue', 'red', 'green'];

const form = document.getElementById('messages');
const input = document.querySelector('#messages input');

const idGenerator = (idLength) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';

  for (let i = 0; i < idLength; i += 1) {
    const index = Math.floor(Math.random() * 53);
    id += characters[index];
  }

  return id;
};

const nickname = idGenerator(16);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const chatMessage = input.value;

  socket.emit('message', { chatMessage, nickname });
  input.value = '';
  return false;
});

const createMessage = (message) => {
  const ul = document.querySelector('#history-list');

  const li = document.createElement('li');

  li.setAttribute('data-testid', 'message');

  li.innerText = message;
  ul.appendChild(li);
};

const displayUsers = (users) => {

  const ul = document.querySelector('#users-list');

  Object.keys(users).forEach((key) => {
    const li = document.createElement('li');
    console.log('usuarios ativos > ', users[key]);
    li.setAttribute('data-testid', 'online-user');
    li.innerText = users[key];
    ul.appendChild(li);
  });
};

window.onload = function () {
  socket.emit('users', nickname);
};

 socket.on('message', (message) => createMessage(message));
 socket.on('users', (usersConnected) => displayUsers(usersConnected));
