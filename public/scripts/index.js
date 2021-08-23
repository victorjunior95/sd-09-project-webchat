const socket = window.io();
let myId;
const dataTestId = 'data-testid';

const getSendMessageInput = () => document.querySelector('#message-to-send');

const createNewMessage = (data, messageUserId) => {
  //  WhatsApp Version
  // const { chatMessage, messageUserId } = data;

  //  Project Version
  const messagesBox = document.querySelector('#messages-box');
  // Message div
  const messageDiv = document.createElement('div');
  if (myId === messageUserId) {
    messageDiv.className = 'message my';
  } else {
    messageDiv.className = 'message other';
  }

  //  Message span
  const span = document.createElement('span');
  span.setAttribute(dataTestId, 'message');
  //  WhatsApp Version
  // span.innerText = chatMessage;

  //  Project Version
  span.innerText = data;
  messageDiv.appendChild(span);

  messagesBox.appendChild(messageDiv);
};

const loadMessageHistory = (message, nickname, timestamp) => {
  //  WhatsApp Version
  // const { chatMessage, messageUserId } = data;

  //  Project Version
  const messagesBox = document.querySelector('#messages-box');
  // Message div
  const messageDiv = document.createElement('div');
  if (myId === nickname) {
    messageDiv.className = 'message my';
  } else {
    messageDiv.className = 'message other';
  }

  //  Message span
  const span = document.createElement('span');
  span.setAttribute(dataTestId, 'message');
  //  WhatsApp Version
  // span.innerText = chatMessage;

  //  Project Version
  span.innerText = `${timestamp} - ${nickname}: ${message}`;
  messageDiv.appendChild(span);

  messagesBox.appendChild(messageDiv);
};

const clearSendMessageInput = () => {
  getSendMessageInput().value = '';
};

const sendMessage = () => {
  const messageToSend = document.querySelector('#message-to-send').value;
  if (messageToSend === '') return;
  console.log(messageToSend);
  socket.emit('message', { nickname: myId, chatMessage: messageToSend });
  clearSendMessageInput();
};

const sendButtonListener = () => {
  const button = document.querySelector('#message-send');
  button.addEventListener('click', sendMessage);
};

const sendEnterListener = () => {
  const input = getSendMessageInput();
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
};

const showUserNickName = (name) => {
  const div = document.querySelector('#online-user');
  div.innerHTML = `${name}`;
};

const changeNickname = () => {
  const nickname = document.querySelector('#nickname-box');
  myId = nickname.value;
  showUserNickName(myId);
  nickname.value = '';
  socket.emit('updateName', myId);
};

const changeNickNameListener = () => {
  const saveBtn = document.querySelector('#nickname-button');
  const input = document.querySelector('#nickname-box');

  saveBtn.addEventListener('click', changeNickname);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      changeNickname();
    }
  });
};

const generateRandomName = () => {
  //  https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  const rnd = (len, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => 
  [...Array(len)].map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  
  myId = rnd(16);
};

const generateUserCard = (name) => {
  const usersDiv = document.querySelector('#online-users-list');
  const card = document.createElement('div');
  card.className = 'user-card';

  const imgDiv = document.createElement('div');
  imgDiv.className = 'user-img';
  const img = document.createElement('img');
  img.setAttribute('src', '../public/images/770137_man_512x512.png');
  imgDiv.appendChild(img);

  const userInfDiv = document.createElement('div');
  userInfDiv.className = 'user-informations';
  const userName = document.createElement('div');
  userName.setAttribute('data-testid', 'online-user');
  userName.className = 'user-name';
  userName.innerHTML = name || 'Usuario';
  userInfDiv.appendChild(userName);

  card.appendChild(imgDiv);
  card.appendChild(userInfDiv);
  usersDiv.appendChild(card);
};

const clearUsersTable = () => {
  const usersDiv = document.querySelector('#online-users-list');
  usersDiv.innerHTML = '';
};

//  Add listeners
sendEnterListener();
sendButtonListener();
changeNickNameListener();

generateRandomName();
showUserNickName(myId);

socket.emit('userConnected', myId);
socket.on('message', (data) => createNewMessage(data));
socket.on('onlineUsers', (data) => {
  clearUsersTable();
  data.forEach((userData) => {
    if (userData.id.name === myId) {
      generateUserCard(userData.id.name);
    }
  });
  data.forEach((userData) => {
    if (userData.id.name !== myId) {
      generateUserCard(userData.id.name);
    }
  });
});
socket.on('userDisconnected', (data) => generateUserCard(data));
socket.on('messageHistory', (messageHistory) => {
  messageHistory.forEach((data) => {
    const { message, nickname, timestamp } = data;
    loadMessageHistory(message, nickname, timestamp);
  });
});
