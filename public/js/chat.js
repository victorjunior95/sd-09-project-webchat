const socket = window.io();

const form = document.getElementById('messages');
const input = document.querySelector('#messages input');

const btnNickname = document.getElementById('btn-nikname');
const inputNickname = document.querySelector('#nickname input');

const idGenerator = (idLength) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';

  for (let i = 0; i < idLength; i += 1) {
    const index = Math.floor(Math.random() * 51);
    id += characters[index];
  }

  return id;
};

let nickname = idGenerator(16);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const chatMessage = input.value;

  socket.emit('message', { chatMessage, nickname });
  input.value = '';
  return false;
});

btnNickname.addEventListener('click', (event) => {
  event.preventDefault();
  const newNickname = inputNickname.value;
  nickname = newNickname;

  socket.emit('updateNickname', newNickname);
  inputNickname.value = '';
  return false;
});

const createMessage = (message) => {
  const ul = document.querySelector('#history-list');

  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  ul.appendChild(li);
};

const displayUsers = (users) => {
  const ul = document.querySelector('#users-list');
  ul.innerHTML = '';

  Object.keys(users).forEach((key) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.innerText = users[key];
    ul.appendChild(li);
  });
};

const sendNickname = (message) => {
  console.log(`[server] > ${message}`);
  socket.emit('users', nickname);
};
/* window.onload = () => {
  socket.emit('users', nickname);
}; */

socket.on('requestNickname', (message) => sendNickname(message));

socket.on('message', (message) => createMessage(message));
// socket.on('updateNickname', (updatedUsers) => displayUsers(updatedUsers));
socket.on('users', (usersConnected) => displayUsers(usersConnected));

window.onbeforeunload = (_event) => {
  socket.disconnect();
};
