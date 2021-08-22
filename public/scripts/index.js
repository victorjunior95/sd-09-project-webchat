const socket = window.io();
let myId;

const getSendMessageInput = () => document.querySelector('#message-to-send');

const createNewMessage = (data) => {
  //  WhatsApp Version
  // const { chatMessage, messageUserId } = data;

  //  Project Version
  const { messageUserId } = data;
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
  span.setAttribute('data-testid', 'message');
  //  WhatsApp Version
  // span.innerText = chatMessage;

  //  Project Version
  span.innerText = data;
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

//  Add listeners
sendEnterListener();
sendButtonListener();
changeNickNameListener();

generateRandomName();
showUserNickName(myId);

socket.emit('ping');
socket.on('message', (data) => createNewMessage(data));
