const socket = window.io('http://localhost:3000');

const messageBtn = document.querySelector('#message-btn');
const messageInput = document.querySelector('#message-input');
const messagesList = document.querySelector('#messages');
const usersList = document.querySelector('#users-list');
const nicknameForm = document.querySelector('#nickname-form');
const nicknameInput = document.querySelector('#nickname-input');

let nickname = null;

messageBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const chatMessage = messageInput.value;
  socket.emit('message', { chatMessage, nickname });
  messageInput.value = '';
});

const createMessage = (message) => {
  const newMessage = document.createElement('li');
  newMessage.setAttribute('data-testid', 'message');
  newMessage.innerText = message;
  messagesList.appendChild(newMessage);
};

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const updatedNickname = nicknameInput.value;
  nickname = updatedNickname;
  socket.emit('updateNickname', nickname);
  nicknameInput.value = '';
});

const createUser = (newUserInfo) => {
  const newUser = document.createElement('li');
  newUser.setAttribute('data-testid', 'online-user');
  newUser.innerText = newUserInfo;
  usersList.appendChild(newUser);
};

socket.on('message', (message) => createMessage(message));

socket.on('login', (newUserInfo) => {
  nickname = newUserInfo;
  createUser(nickname);
});

/* socket.on('getAllMessages', (messages) => {
  messages.forEach((message) => createMessage(message));
}); */
/* socket.on('updateOnlineUsersList', (onlineUsersList) => {
  usersList.innerHTML = '';
  createUser(nickname);
  onlineUsersList.forEach((user) => {
    if (user !== nickname) {
      createUser(user);
    }
  });
});
 */