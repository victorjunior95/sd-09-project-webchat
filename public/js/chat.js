const socket = window.io();

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

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const nickname = idGenerator(16);
  const chatMessage = input.value;

  socket.emit('message', { chatMessage, nickname });
  input.value = '';
  return false;
});

const createMessage = (message) => {
  // const { chatMessage, users } = message;

  const ul = document.querySelector('#history-list');

  const li = document.createElement('li');

  // const msg = `<span data-testid="online-user">${nickname}</span> `;

  li.innerText = message;
  ul.appendChild(li);
};

const displayUsers = (users) => {
  console.log('[users] > ', users);
};

 socket.on('message', (message) => createMessage(message));
 socket.on('users', (users) => displayUsers(users));
