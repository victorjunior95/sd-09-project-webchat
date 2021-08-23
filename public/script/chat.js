const socket = window.io();

const sendButton = document.querySelector('#sendButton');
const inputMessage = document.querySelector('#messageInput');
const nicknameButton = document.querySelector('#nicknameButton');
const inputNickname = document.querySelector('#nicknameBox');
const usersUl = document.querySelector('#usersOnline');

let nickname = '';

nicknameButton.addEventListener('click', (e) => {
  e.preventDefault();
  nickname = inputNickname.value;
  socket.emit('nicknameChange', inputNickname.value);
  inputNickname.value = '';
  return false;
});

sendButton.addEventListener('click', (e) => {
  if (!nickname) nickname = socket.id.slice(1, 17);
  e.preventDefault();
  socket.emit('message', { chatMessage: inputMessage.value, nickname });
  inputMessage.value = '';
  return false;
});

// cria um li e coloca abaixo da ul #messages

const newMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

// Precisa trazer o nick do usuário para o primeiro
const usersList = (userList) => {
  nickname = userList[socket.id];
  usersUl.innerHTML = '';
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.setAttribute('id', 'usersList');
  li.innerText = nickname; 
    usersUl.appendChild(li);
  const nicknameList = Object.values(userList);
  nicknameList.forEach((id) => {
    if (id !== nickname) {
      const liUsers = document.createElement('li');
      liUsers.setAttribute('data-testid', 'online-user');
      liUsers.setAttribute('id', 'usersList');
      liUsers.innerText = id; 
      usersUl.appendChild(liUsers);
    }
  });
};

socket.on('usersList', (userList) => usersList(userList));

socket.on('showHistory', (history) => {
  history.forEach((message) => {
    const format = `${message.timestamp} ${message.nickname} diz: ${message.chatMessage}`;
    newMessage(format);
  });
});
socket.on('message', (chatMessage) => newMessage(chatMessage));
socket.on('nicknameChange', (userList) => usersList(userList));
