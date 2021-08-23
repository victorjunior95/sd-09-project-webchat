const socket = window.io();

const sendButton = document.querySelector('#sendButton');
const inputMessage = document.querySelector('#messageInput');
const nicknameButton = document.querySelector('#nicknameButton');
const inputNickname = document.querySelector('#nicknameBox');

const nickname = '';

nicknameButton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('nicknameChange', inputNickname.value);
  inputNickname.value = '';
  return false;
});

sendButton.addEventListener('click', (e) => {
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

// o tempo de resposta tá muito alto com o código abaixo
const usersList = (onlineUsers) => {
  const usersDiv = document.querySelector('#usersOnline');
  usersDiv.innerHTML = '';
  onlineUsers.forEach((user) => {
    const p = document.createElement('p');
    p.setAttribute('id', 'usersList');
    usersDiv.appendChild(p);
    p.innerText = user; 
});
};

// Quanto o evento usersOnline for emitido, a mensagem será tansformada num li pela funcao newMessage
socket.on('usersList', (onlineList) => {
  usersList(onlineList);
});
socket.on('online', (message) => newMessage(message));
socket.on('showHistory', (history) => {
  history.forEach((message) => {
    const format = `${message.timestamp} ${message.nickname} diz: ${message.chatMessage}`;
    newMessage(format);
  });
});
socket.on('message', (chatMessage) => newMessage(chatMessage));
socket.on('nicknameChange', (onlineList) => usersList(onlineList));
