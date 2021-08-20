const socket = window.io();
const dataTestid = 'data-testid';

const updateMsg = (msgHistory) => {
  const messagesUl = document.querySelector('#messages');

  msgHistory.forEach(({ message, nickname, timestamp }) => {
    const chatMessage = `${timestamp} - ${nickname}: ${message}`;
    const li = document.createElement('li');
    li.innerText = chatMessage;
    li.setAttribute(dataTestid, 'message');
    messagesUl.appendChild(li);
  });
};

socket.on('msgHistory', updateMsg);

const form = document.querySelector('#formChat');
const formChangeNickName = document.querySelector('#changeNickName');
const inputMessage = document.querySelector('#messageInput');
const inputNickName = document.querySelector('#changeNickInput');
let user = null;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = inputMessage.value;

  socket.emit('message', { chatMessage: message, nickname: user.nickname });
  inputMessage.value = '';
});

formChangeNickName.addEventListener('submit', (e) => {
  e.preventDefault();
  const newNickName = inputNickName.value;
  user.nickname = newNickName;
  console.log(user);
  socket.emit('newNickName', user);
  inputNickName.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');

  li.innerText = message;
  li.setAttribute(dataTestid, 'message');
  messagesUl.appendChild(li);
};

const newUser = (userConnected) => {
  if (user) return;
  user = userConnected;
};

const updateUsersOnline = (usersOnline) => {
  const userList = document.querySelector('#usersOnline');
  userList.innerHTML = '';

  let li = document.createElement('li');
  li.setAttribute(dataTestid, 'online-user');
  li.innerText = user.nickname;
  userList.appendChild(li);

  usersOnline.forEach((element) => {
    if (element.id !== user.id) {
      li = document.createElement('li');
      li.setAttribute(dataTestid, 'online-user');
      li.innerText = element.nickname;
      userList.appendChild(li);
    }
  });
};

const changeNickName = (onlineUsers) => {
  updateUsersOnline(onlineUsers);
};

window.onbeforeunload = () => {
  socket.disconnect();
};
socket.on('userConnected', newUser);
socket.on('usersOnline', updateUsersOnline);
socket.on('message', (objResult) => createMessage(objResult));
socket.on('nickNameChanged', changeNickName);