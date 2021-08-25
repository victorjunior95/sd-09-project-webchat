let nickname = '';

const generateRandomName = (legnth) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  let nickNameUser = '';
  for (let i = 0; i < legnth; i += 1) {
    const rnum = Math.floor(Math.random() * alphabet.length);
    nickNameUser += alphabet.substring(rnum, rnum + 1);
  }
  return nickNameUser;
 };

nickname = generateRandomName(16);

const socket = window.io('http://localhost:3000/', {
  query: {
    nickname,
  },
});

const newUser = (user) => {
  const usersList = document.querySelector('#users-on');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.innerText = user;
  usersList.appendChild(li);
};

const nicknameBtn = document.querySelector('#nickname-button');
const nicknameInput = document.querySelector('#nickname-box');
nicknameBtn.addEventListener('click', (e) => {
  e.preventDefault();
  nickname = nicknameInput.value;
  socket.emit('changeNickname', nickname);
  nicknameInput.value = '';
  return false;
});

const newMessage = (message) => {
  const messageList = document.querySelector('#message-list');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messageList.appendChild(li);
};

const messageInput = document.querySelector('#message-box');
const sendButton = document.querySelector('#send-button');
sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', {
    nickname,
    chatMessage: messageInput.value,
  });
  messageInput.value = '';
  messageInput.focus();
  return false;
});

socket.on('message', (message) => newMessage(message));

socket.on('onlineUser', (users) => {
  const onlineList = document.querySelector('#users-on');
  onlineList.innerHTML = '';
  newUser(nickname);
  users.forEach((user) => {
    if (user !== nickname) newUser(user);
});
});

socket.on('connection', () => socket.emit('getHistory'));

socket.on('chatHistory', (chatHistory) => chatHistory.forEach((message) => newMessage(message)));