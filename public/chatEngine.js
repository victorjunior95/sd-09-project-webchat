const socket = window.io();

const messageBtn = document.querySelector('#messageBtn');
const userPlace = document.querySelector('#user');
const messageInput = document.querySelector('#messageInput');
const nickNameInput = document.querySelector('#nickName');
const messages = document.querySelector('#messages');
const onlineUser = document.querySelector('#onlineUser');
let nickname = '';

const getNickName = (str) => {
  const userNick = document.createElement('li');
  userNick.innerText = str;  
  userNick.setAttribute('data-testId', 'online-user');
  onlineUser.appendChild(userNick);
  localStorage.setItem(`${socket.id}`, str);
};

messageBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: messageInput.value, nickname });
  messageInput.value = '';
});

userPlace.addEventListener('click', (e) => {
  e.preventDefault();
  const userNickname = nickNameInput.value;
  nickname = userNickname;
  localStorage.setItem('nickname', userNickname);
  socket.emit('nickname', userNickname);
  nickNameInput.value = '';
});

socket.on('newConnection', (chatHistory) => {
  chatHistory.forEach((msg) => {
    const msgItem = document.createElement('li');
    msgItem.setAttribute('data-testId', 'message');
    msgItem.innerText = msg;
    onlineUser.appendChild(msgItem);
  });
});

socket.on('onlineUsersUpdate', (users) => {
  onlineUser.innerHTML = null;
  if (!nickname) {
    nickname = users[users.length - 1];
  }
  getNickName(nickname);
  const otherUsers = users.filter((user) => user !== nickname);
  otherUsers.forEach((user) => {
      getNickName(user);
  });
});

socket.on('message', (message) => {
  const incomingMessage = document.createElement('li');
  incomingMessage.setAttribute('data-testid', 'message');
  incomingMessage.innerText = message;
  messages.appendChild(incomingMessage);
});
