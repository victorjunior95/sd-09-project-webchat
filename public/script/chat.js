const socket = window.io();

const form = document.querySelector('form');
const inputMessage = document.querySelector('#messageInput');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', inputMessage.value);
  inputMessage.value = '';
  return false;
});

// cria um li e coloca abaixo da ul #messages

const newMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  messagesUl.appendChild(li);
};

// Quanto o evento welcome for emitido, a mensagem será tansformada num li pela funcao newMessage
socket.on('welcome', (message) => newMessage(message));
socket.on('online', (message) => newMessage(message));
socket.on('retorno', (message) => newMessage(message));
socket.on('message', (message) => newMessage(message));
