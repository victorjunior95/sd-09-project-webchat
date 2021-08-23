const socket = window.io();

const NICKNAMEBOX = document.querySelector('.nickname-box');
const ONLINEUSER = document.querySelector('.online-user');
const ONLINEUSERLI = document.querySelectorAll('.online-user li');
const MESSAGEBOX = document.querySelector('.message-box');

// adicionando nickname no input
const inputNickname = (nickname) => {
  NICKNAMEBOX.value = nickname;

  if (ONLINEUSERLI.length) {
    ONLINEUSER.innerHTML = '';
  }

  ONLINEUSER.insertAdjacentHTML('beforeend', `<li>${nickname}</li>`);
};

// gera nickname com 16 caracteres alfanumérico
// https://www.codegrepper.com/code-examples/javascript/discord.js+random+character+generator
const nicknameGenerator = () => {
  let nickname = '';

  const lengthString = 16;
  const characteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let index = 0; index < lengthString; index += 1) {
    nickname += characteres.charAt(
      Math.floor(Math.random() * characteres.length),
    );
  }

  inputNickname(nickname);
};

// exibindo a mensagem na tela
const renderMessage = (message) => {
  document
    .querySelector('.messages')
    .insertAdjacentHTML(
      'beforeend',
      `<div data-testid="message">${message}</div>`,
    );
};

// adicionando nickname no campo input
window.onload = () => {
  nicknameGenerator();
};

// recebe mensagens do backend
socket.on('message', (message) => {
  renderMessage(message);
});

document.getElementById('form-chat').addEventListener('submit', (event) => {
  event.preventDefault();

  const nickname = NICKNAMEBOX.value;
  const chatMessage = MESSAGEBOX.value;

  if (nickname.length && chatMessage.length) {
    const dateActual = new Date().toLocaleString();
    const formatedData = dateActual.replace(/\//g, '-');

    const sendMessage = {
      chatMessage,
      nickname,
      timestamp: formatedData,
    };

    // enviamos as informacoes para o backend
    socket.emit('message', sendMessage);

    chatMessage.value = '';
  }
});

document.getElementById('form-nickname').addEventListener('submit', (event) => {
  event.preventDefault();

  const nickname = document.querySelector('.nickname-box').value;

  if (nickname.length) {
    inputNickname(nickname);
  }
});
