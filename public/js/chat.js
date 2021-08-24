const socket = window.io();
// referencia: https://www.ti-enxame.com/pt/javascript/gere-stringcaracteres-aleatorios-em-javascript/967048592/
// const crypto = require('crypto'); 

const nickname = `user-${Math.random().toString().slice(2, 13)}`; // crypto.randomBytes(20).toString('hex');

localStorage.setItem('nickname', nickname);

const sendMessage = document.querySelector('#send-button');
const inputMessage = document.querySelector('#message-input');
const nickNameForm = document.querySelector('#nick-name-form');
const inputNickName = document.querySelector('#nick-name-input');
console.log(sendMessage);

const createNickNameList = (nickName) => {
  const nickNameUl = document.querySelector('#nick-name');
  const li = document.createElement('li');
  li.innerText = nickName;
  li.setAttribute('data-testid', 'online-user');
  nickNameUl.appendChild(li);
  return nickName;
};

socket.emit('login', nickname);
socket.on('onlineUsers', (users) => createNickNameList(users));

nickNameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nickName = localStorage.setItem('nickname', inputNickName.value);
  createNickNameList(nickName);
  return false;
});

sendMessage.addEventListener('click', (e) => {
  e.preventDefault();
  const chatMessage = inputMessage.value;
  console.log('oi2');
  const id = localStorage.getItem('nickname');
  socket.emit('message', { chatMessage, nickname: id });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));