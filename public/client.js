const socket = window.io();

const form = document.querySelector('#form');
const nick = document.querySelector('#nickname');
const input = document.querySelector('#messageInput');
const nickNameButton = document.querySelector('#saveNickname');
const ulMessage = document.querySelector('#messages');
const ulUsers = document.querySelector('#onlineUsers');
let userNickname;
const datatestid = 'data-testid';

/* Muda Nickname */
nickNameButton.addEventListener('click', () => {
  userNickname = nick.value;
  socket.emit('newNick', userNickname);
  nick.value = '';
});

/* Cria mensagem */
const createMessage = (msg) => {
  const liMessage = document.createElement('li');
  liMessage.innerText = msg;
  liMessage.setAttribute(datatestid, 'message');
  ulMessage.appendChild(liMessage);
};

const historyMessage = (messages) => {
  messages.forEach(({ chatMessage, nickname, timestamp }) => {
    const liMessage = document.createElement('li');
    liMessage.innerText = `${timestamp} - ${nickname}: ${chatMessage}`;
    liMessage.setAttribute(datatestid, 'message');
    ulMessage.appendChild(liMessage);
  }); 
};

/* Envia dados digitados no form */
form.addEventListener('submit', (event) => {
  event.preventDefault();
  socket.emit('message', { chatMessage: input.value, nickname: userNickname });
  input.value = '';
});

/* Recebe dados mensagem formatado */
socket.on('message', (msg) => createMessage(msg));
socket.on('history', (msg) => historyMessage(msg));  

/* Cria user */
socket.on('userOnline', (user) => {
  userNickname = user;
  socket.emit('newNick', userNickname);
});

/* Mostra todos os usuários na tela */
socket.on('allUsers', (userList) => {
  ulUsers.innerHTML = '';
  userList.forEach((userName) => {
    const liUser = document.createElement('li');
    liUser.innerText = userName;
    liUser.setAttribute(datatestid, 'online-user');
    ulUsers.appendChild(liUser);
  });
});
