const socket = window.io();

let localUser;

window.onbeforeunload = () => {
  const storage = JSON.parse(localStorage.getItem('users'));
  const newUsers = storage.filter((item) => item.socketId !== localUser.socketId);
  localStorage.setItem('users', JSON.stringify(newUsers));
  socket.disconnect();
};

const messagesUl = document.querySelector('#messages-content');

const createMessage = (message) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

const usersUl = document.querySelector('#users-content');

const createUser = (message) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.innerText = message;
  usersUl.appendChild(li);
};

const nicknameForm = document.querySelector('#nickname-form');
const nicknameInput = document.querySelector('#nickname-input-id');

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const storage = JSON.parse(localStorage.getItem('users'));
  socket.emit('clientNickname', { newNick: nicknameInput.value, users: storage });
  nicknameInput.value = '';
  return false;
});

const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input-id');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: messageInput.value, nickname: localUser.nickname });
});

socket.on('setUser', (user) => {
  localUser = user;
  const storage = JSON.parse(localStorage.getItem('users')) || [];
  storage.push(user);
  localStorage.setItem('users', JSON.stringify(storage));
  socket.emit('login', storage);
});

socket.on('login', (users) => {
  usersUl.innerHTML = '';
  users.forEach((item) => createUser(item.nickname));
});

socket.on('loginClient', (MyUsers) => {
  const { userToSend, user } = MyUsers;

  // ideia inspirada no código do Daniel Fasanaro para ordenar os usuários online!
  userToSend.sort((a, b) => {
    if (a.socketId === user.socketId) return -1;
    if (b.socketId === user.socketId) return 1;
    return 0;
  });
    // ideia inspirada no código do Daniel Fasanaro para ordenar os usuários online!

  usersUl.innerHTML = '';
  userToSend.forEach((item) => createUser(item.nickname));
});

socket.on('starterMessages', (messages) => {
  messagesUl.innerHTML = '';
  messages.forEach((item) => createMessage(item.messageToRender));
});

socket.on('message', (newMessage) => {
  console.log(newMessage);
  createMessage(newMessage);
});

socket.on('updateListOfUsers', (users) => {
  usersUl.innerHTML = '';
  console.log(users);
  localStorage.setItem('users', JSON.stringify(users));

  users.forEach((item) => createUser(item.nickname));
});

socket.on('disconnectMe', (user) => {
  const storage = JSON.parse(localStorage.getItem('users'));
  const newUsers = storage.filter((item) => item.socketId !== user.socketId);
  localStorage.setItem('users', JSON.stringify(newUsers));
  socket.emit('updateUsers', newUsers);
});

socket.on('updateUser', (newUser) => {
  localUser = newUser;
});
