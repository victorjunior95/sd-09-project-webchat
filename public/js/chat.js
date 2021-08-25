const socket = window.io();

const nickname = `user-${Math.random().toString().slice(2, 13)}`;

localStorage.setItem('nickname', nickname);
socket.emit('login', nickname);

const sendMessage = document.querySelector('#send-button');
const inputMessage = document.querySelector('.message-input');
const nickNameForm = document.querySelector('.nick-name-form');
const inputNickName = document.querySelector('#nick-name-input');
const nickNameUl = document.querySelector('#nick-name');

const createNickNameList = (users) => {
  nickNameUl.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.nickname;
    li.setAttribute('data-testid', 'online-user');
    nickNameUl.appendChild(li);  
  });
  return false;
};

const updateNickNameList = (users) => {
  createNickNameList(users);
};

nickNameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nickName = inputNickName.value;
  console.log(nickName);
  localStorage.setItem('nickname', inputNickName.value);
  console.log(localStorage.nickName);
  inputNickName.value = '';
  socket.emit('updateUser', nickName);
  return false;
});

sendMessage.addEventListener('click', (e) => {
  e.preventDefault();
  const chatMessage = inputMessage.value;
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
socket.on('onlineUsers', (users, historicMessages) => {
  createNickNameList(users);
  historicMessages.forEach((message) => createMessage(message));
});
socket.on('updateUser', (users) => updateNickNameList(users));
socket.on('deletedUser', (users) => createNickNameList(users));