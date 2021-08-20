const socket = window.io();

const users = [];

const form = document.getElementById('messages');
const input = document.querySelector('#messages input');

const idGenerator = (idLength) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';

  for (let i = 0; i < idLength; i += 1) {
    const index = Math.floor(Math.random() * 53);
    id += characters[index];
  }

  return id;
};

/* const sendToLocalStorage = () => {
  if (typeof (Storage) !== 'undefined') {
    // localStorage.clear();
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Salvo no localstorage!');
  }
};

/* const sendToLocalStorage = (user) => {
  if (typeof (Storage) !== 'undefined') {
    // localStorage.clear();
    const users = JSON.parse(localStorage.getItem('users'));
    console.log('localStorage >', users);
    if (users === null) {
      localStorage.setItem('users', JSON.stringify([user]));
    } else {
      localStorage.setItem('users', JSON.stringify([...users, user]));
      console.log('Salvo no localstorage!');
    }
  }
}; 

const getLocalSorage = () => {
  const usersLocalStorage = JSON.parse(localStorage.getItem('users'));
  if (users === null) {
    localStorage.setItem('users', JSON.stringify([]));
    return [];
  }
  return usersLocalStorage; 
};*/

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const nickname = idGenerator(16);
  const chatMessage = input.value;

  socket.emit('message', { chatMessage, nickname });
  input.value = '';
  return false;
});

const createMessage = (message) => {
  // const { chatMessage, users } = message;

  const ul = document.querySelector('#history-list');

  const li = document.createElement('li');

  // const msg = `<span data-testid="online-user">${nickname}</span> `;

  li.setAttribute('data-testid', 'message');

  li.innerText = message;
  ul.appendChild(li);
};

const displayUsers = (user) => {
  users.push(user);
  // sendToLocalStorage();
  // const re = getLocalSorage();
  console.log('[users] > ', users);
};

 socket.on('message', (message) => createMessage(message));
 socket.on('users', (usersConnected) => displayUsers(usersConnected));
