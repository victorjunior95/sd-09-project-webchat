const socket = window.io();

const DATA_TEST_ID = 'online-user';
const ONLINE_USERS = '#online-user';

const btnSend = document.querySelector('#btn-send');
const btnSave = document.querySelector('#btn-save');
const ulUsers = document.querySelector('#ulUsers');
const spanNick = document.querySelector('#myNickName');

btnSave.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('entrou');
  const inputNickname = document.querySelector('#input-nickname');
  spanNick.innerText = inputNickname.value;
  socket.emit('changeNickName', inputNickname.value);
  inputNickname.value = '';
});

btnSend.addEventListener('click', (e) => {
  e.preventDefault();
  const inputMessage = document.querySelector('#input-message');
  socket.emit('message', {
    nickname: spanNick.innerText,
    chatMessage: inputMessage.value,
  });
  inputMessage.value = '';
});

const insertNickName = (nickName) => {
  spanNick.setAttribute('data-testid', DATA_TEST_ID);
  spanNick.innerText = nickName;
};

const insertUsers = (users) => {
  console.log(users);
  const myNick = document.querySelector('#myNickName');
  ulUsers.innerHTML = '';
  users.forEach((user) => {
    if (myNick.innerText !== user.nickName) {
      const li = document.createElement('li');
      li.setAttribute('data-testid', DATA_TEST_ID);
      li.innerText = user.nickName;
      ulUsers.appendChild(li);
    }
  });
};

const insertMessage = (message) => {
  const ulMessages = document.querySelector('#ulMessages');
  const li = document.createElement('li');
  li.dataset.testid = 'message';
  li.innerText = message;
  ulMessages.appendChild(li);
};

socket.on('message', (message) => insertMessage(message));

socket.on('changeNickName', (users) => insertUsers(users));

socket.on('logout', (users) => insertUsers(users));

socket.on('refreshUsers', (nickName) => {
  const listOnlineUsers = document.querySelectorAll(ONLINE_USERS);
  let status = false;

  for (let i = 0; i < listOnlineUsers.length; i += 1) {
    if (listOnlineUsers[i].innerText === nickName) status = true;
  }

  if (!status) insertNickName(nickName);
});

socket.on('newUser', (users) => {
  insertUsers(users);
});

socket.on('welcome', ({ nickname, messages, users }) => {
  insertNickName(nickname);
  messages.forEach((message) =>
    insertMessage(`${message.timestamp} - ${message.nickname}: ${message.message}`));
  if (users) insertUsers(users);
  socket.emit('login', nickname);
});
