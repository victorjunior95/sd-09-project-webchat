const socket = window.io();
const button = document.getElementById('pingButton');

button.addEventListener('click', () => {
  socket.emit('ping');
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.getElementById('messages');
  const li = document.createElement('li');
  li.innerText = message;
  messagesUl.appendChild(li);
};

socket.on('ola', (mensagem) => createMessage(mensagem));
socket.on('pong', (mensagem) => createMessage(mensagem));
