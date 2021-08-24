const socket = window.io();

const messageBtn = document.querySelector('#messageBtn');
const user = document.querySelector('#user');
const messageInput = document.querySelector('#messageInput');
const nickNameInput = document.querySelector('#nickName');
const messages = document.querySelector('#messages');
const onlineUser = document.querySelector('#onlineUser');

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const getNickName = (length) => {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i += 1) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

const nickName = getNickName(16);
localStorage.setItem('nickname', nickName);
onlineUser.innerText = nickName;

messageBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const storeNickname = await localStorage.getItem('nickname');
  socket.emit('message', { chatMessage: messageInput.value, nickname: storeNickname });
  messageInput.value = '';
  return false;
});

user.addEventListener('click', (e) => {
  e.preventDefault();
  const userNickname = nickNameInput.value;
  onlineUser.innerText = userNickname;
  localStorage.setItem('nickname', userNickname);
  socket.emit('nickname', userNickname);
  nickNameInput.value = '';
  return false;
});

socket.on('message', (message) => {
  const incomingMessage = document.createElement('li');
  incomingMessage.setAttribute('data-testid', 'message');
  incomingMessage.innerText = message;
  messages.appendChild(incomingMessage);
});