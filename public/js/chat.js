const socket = window.io();

const messageForm = document.querySelector('#message-form');
const inputMessage = document.querySelector('#message-input');
const nicknameForm = document.querySelector('#nickname-form');
const nicknameInput = document.querySelector('#nickname-input');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nickname = document.querySelector('#users-list').firstElementChild.innerText;
  socket.emit('message', { chatMessage: inputMessage.value, nickname });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages-list');
  const li = document.createElement('li');
  li.innerText = message;
  li.dataset.testid = 'message';
  messagesUl.appendChild(li);
};

nicknameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  socket.emit('nicknameChange', nicknameInput.value);
  nicknameInput.value = '';
  return false;
});

const renderUserList = (userList) => {
  const usersUl = document.querySelector('#users-list');
  usersUl.innerHTML = '';
  userList.sort((a, b) => {
    if (a.id === socket.id) return -1;
    if (b.id === socket.id) return 1;
    return 0;
  });
  userList.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.nickname;
    li.dataset.testid = 'online-user';
    usersUl.appendChild(li);
  });
};

const renderMessageHistory = (messages) => {
  const messagesUl = document.querySelector('#messages-list');
  messages.forEach(({ message, nickname, timestamp }) => {
    const li = document.createElement('li');
    li.innerText = `${timestamp} - ${nickname}: ${message}`;
    li.dataset.testid = 'message';
    messagesUl.appendChild(li);
  });
};

socket.on('message', (message) => createMessage(message));
socket.on('renderUserList', (userList) => renderUserList(userList));
socket.on('generateNickname', (nickname) => socket.emit('nicknameChange', nickname));
socket.on('messageHistory', (messages) => renderMessageHistory(messages));
