const socket = window.io();

const form = document.querySelector('#form');
const nick = document.querySelector('#nickname');
const input = document.querySelector('#messageInput');
const nickNameButton = document.querySelector('#saveNickname');
let userNickname;

nickNameButton.addEventListener('click', () => {
  userNickname = nick.value;
  socket.emit('newNick', userNickname);
  nick.value = '';
});

const createMessage = (msg) => {
  const ul = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = msg;
  li.setAttribute('data-testid', 'message');
  ul.appendChild(li);
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  socket.emit('message', { chatMessage: input.value, nickname: userNickname });
  input.value = '';
});

socket.on('message', (msg) => createMessage(msg));  

socket.on('userOnline', (user) => {
  userNickname = user;
  socket.emit('newNick', userNickname);
});

socket.on('allUsers', (userList) => {
  const usersList = document.querySelector('#onlineUsers');
  usersList.innerHTML = '';
  userList.forEach((userName) => {
    const user = document.createElement('li');
    user.innerText = userName;
    user.setAttribute('data-testid', 'online-user');
    usersList.appendChild(user);
  });
});
