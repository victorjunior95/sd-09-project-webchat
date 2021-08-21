const socket = window.io();

const chatBtn = document.querySelector('#sendMsg');
const inputMessage = document.querySelector('#messageInput');
const newName = document.querySelector('#newName');
const changeName = document.querySelector('#changeName');
const usersList = document.querySelector('#usersList');

let newNick = '';
let list = [];

const dataTestId = 'data-testid';
const onlineUserId = 'online-user';

socket.emit('msgHistory');
socket.emit('listNames');

const createRandomName = (length) => {
  let result = '';
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    result += validChars.charAt(Math.floor(Math.random() * validChars.length));
  }

  return result;
};

const connectedUsers = async () => {
  newNick = createRandomName(16);

  const li = document.createElement('li');
  li.innerText = newNick;
  li.setAttribute(dataTestId, onlineUserId);
  usersList.appendChild(li);
};

socket.on('wellcome', () => connectedUsers());

chatBtn.addEventListener('click', (event) => {
  event.preventDefault();

  if (!newNick) newNick = createRandomName(16);

  socket.emit('message', {
    nickname: newNick,
    chatMessage: inputMessage.value,
  });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messageUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute(dataTestId, 'message');
  messageUl.appendChild(li);
};

socket.on('message', (mensagem) => createMessage(mensagem));

socket.on('getMesgs', (mesgs) => {
  mesgs.forEach(({ message, nickname, timestamp }) => {
    const msg = `${timestamp} ${nickname}: ${message}`;
    createMessage(msg);
  });
});

const createList = (array) => {
  array.forEach((user) => {
    const li = document.createElement('li');
    li.innerHTML = user;
    li.setAttribute(dataTestId, onlineUserId);
    usersList.appendChild(li);
  });
};

socket.on('updateOnline', ({ names }) => {
  usersList.innerHTML = '';

  const myNick = Object.keys(names).find((user) => user === socket.id);
  const connected = Object.values(names).filter((user) => user !== names[myNick]);

  list = [];
  list.unshift(names[myNick]);
  list.push(...connected);

  createList(list);
});

changeName.addEventListener('click', (event) => {
  event.preventDefault();

  newNick = newName.value;
  socket.emit('changeName', newNick);

  newName.value = '';
  return false;
});

window.onbeforeunload = () => {
  socket.disconnect();
};
