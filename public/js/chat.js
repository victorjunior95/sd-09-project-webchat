const socket = window.io();

const messageForm = document.querySelector('#messageForm');
const inputMessage = document.querySelector('#messageInput');
const nicknameForm = document.querySelector('#nicknameForm');
const inputNickname = document.querySelector('#nicknameInput');
const nicknameWrapper = document.querySelector('#userNickname');

let nickname;

const setClientNickname = (givenNickname) => {
  nickname = givenNickname;
  nicknameWrapper.innerText = nickname;
};

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li['data-testid'] = 'message';
  // li[data-testid] = 'message';
  li.dataset.testid = 'message';
  console.log(li);
  messagesUl.appendChild(li);
};

socket.on('setNickname', (givenNickname) => setClientNickname(givenNickname));
socket.on('message', (message) => createMessage(message));

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = inputMessage.value;
  socket.emit('message', { nickname, chatMessage });
  inputMessage.value = '';
  return false;
});

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newNickname = inputNickname.value;
  socket.emit('setNickname', newNickname);
  setClientNickname(newNickname);
  inputNickname.value = '';
  return false;
});

window.onbeforeunload = () => socket.disconnect();
