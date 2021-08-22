// FRONT-END
const socket = window.io();

const form = document.querySelector('#form');
const nick = document.querySelector('#nickname');
const input = document.querySelector('#messageInput');

/* Monta a mensagem na tela */
const createMessage = (msg) => {
  const ul = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerHTML = msg;
  ul.appendChild(li);
};

/* Quando o form for submetido */
form.addEventListener('submit', (event) => {
  event.preventDefault();

  /* Envia um evento para o server */
  socket.emit('message', { chatMessage: input.value, nickname: nick.value });
  input.value = '';
  return false;
});

/* Escuta o evento do server */
socket.on('message', (msg) => createMessage(msg));  