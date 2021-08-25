const socket = window.io();

const nickname = `user-${Math.random().toString().slice(2, 13)}`;

localStorage.setItem('nickname', nickname);
socket.emit('login', nickname);

const sendMessage = document.querySelector('#send-button');
const inputMessage = document.querySelector('.message-input');
const nickNameForm = document.querySelector('.nick-name-form');
const inputNickName = document.querySelector('#nick-name-input');

const createNickNameList = (users) => {
  const nickNameUl = document.querySelector('#nick-name');
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user;
    li.setAttribute('data-testid', 'online-user');
    nickNameUl.appendChild(li);  
  });
  return false;
};

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
socket.on('onlineUsers', (users) => createNickNameList(users));
socket.on('history', (historyMessages) => {
  historyMessages.forEach((message) => createMessage(message));
});