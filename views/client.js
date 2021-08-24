const socket = window.io();

let nickname;

const form = document.querySelector('form');
const mensagemTexto = document.querySelector('#mensagem');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const mensagem = mensagemTexto.value;
  console.log(mensagem);
  socket.emit('message', { chatMessage: mensagem, nickname });
});

socket.on('message', (data) => {
  console.log(data);
});

socket.on('nickname', (guestName) => {
  nickname = guestName;
});
