const socket = window.io();

const form = document.querySelector('#message-form');
const newMessage = document.querySelector('#message-text');
const list = document.querySelector('#message-list');

const nickname = 'Stranger';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: newMessage.value, nickname });
  newMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const li = document.createElement('li');
  li.innerText = message;
  list.appendChild(li);
};

socket.on('message', (message) => createMessage(message));
