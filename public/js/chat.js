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
  const ul = document.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
};

socket.on('message', (message) => createMessage(message));