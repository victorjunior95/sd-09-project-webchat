const socket = window.io();
const DATA_TESTID = 'data-testid';
const you = document.getElementById('you');
const sendButton = document.getElementById('send-button');
const inputMessage = document.getElementById('chat-input');
const nicknameBox = document.getElementById('nickname-box');
const nicknameButton = document.getElementById('nickname-button');
const messagesArea = document.getElementById('messages');
const userList = document.getElementById('users');
const totalUsers = document.getElementById('total-users');
const localNickname = localStorage.getItem('nickname');

if (localNickname) {
  you.innerText = localNickname;
  socket.emit('connected', localNickname);
} else {
  // caso o usuário não esteja salvo, emitir um newUser
  socket.emit('newUser');
}

sendButton.addEventListener('click', () => {
  socket.emit('message', { nickname: you.innerText, chatMessage: inputMessage.value });
  inputMessage.value = '';
});

nicknameButton.addEventListener('click', () => {
  socket.emit('newNickname', { newNickname: nicknameBox.value, oldNickname: you.innerText });
  localStorage.setItem('nickname', nicknameBox.value);
  you.innerText = nicknameBox.value;
});

const enteredChatMessage = (newUser) => {
  const newUserMessage = document.createElement('li');
  newUserMessage.classList.add('new-user');
  newUserMessage.innerText = `${newUser} has entered the chat`;
  return messagesArea.appendChild(newUserMessage);
};

const leftChatMessage = (user) => {
  const leftUserMessage = document.createElement('li');
  leftUserMessage.classList.add('new-user');
  leftUserMessage.innerText = `${user} has left the chat`;
  messagesArea.appendChild(leftUserMessage);
  leftUserMessage.scrollIntoView();
};

const userElement = (newUser) => {
  const div = document.createElement('div');
  const img = document.createElement('img');
  img.src = '/images/avatar.svg';
  img.height = '20';
  const li = document.createElement('li');
  li.setAttribute(DATA_TESTID, 'online-user');
  li.innerText = `${newUser}`;
  div.appendChild(img);
  div.appendChild(li);
  return div;
};

const appendNewUser = ({ newUser }) => {
  const list = [...userList.children];
  const index = list.findIndex((user) => user.innerText === newUser);
  if (index === -1) {
    totalUsers.innerText = `Users (${[...userList.children].length + 1})`;
    enteredChatMessage(newUser);
  } else {
    userList.removeChild(userList.children[index]);
  }
  const element = userElement(newUser);
  if (newUser === you.innerText || you.innerText === '') {
    return userList.prepend(element);
  }
  return userList.appendChild(element);
};

const appendNewMessage = (message) => {
  const newUserMessage = document.createElement('li');
  newUserMessage.classList.add('message');
  newUserMessage.setAttribute(DATA_TESTID, 'message');
  newUserMessage.innerHTML = message;
  messagesArea.appendChild(newUserMessage);
  newUserMessage.scrollIntoView();
};

const appendNewNickname = ({ oldNickname, newNickname }) => {
  const list = [...userList.children];
  const index = list.findIndex((user) => user.innerText === oldNickname);
  userList.children[index].innerText = newNickname;
};

const removeUser = (nickname) => {
  const list = [...userList.children];
  const index = list.findIndex((user) => user.innerText === nickname);
  userList.removeChild(userList.children[index]);
  totalUsers.innerText = `Users (${[...userList.children].length})`;
  return leftChatMessage(nickname);
};

socket.on('connected', appendNewUser);

socket.on('message', appendNewMessage);

socket.on('newNickname', appendNewNickname);

socket.on('newUser', ({ newUser }) => {
  localStorage.setItem('nickname', newUser);
  you.innerText = newUser;
});

socket.on('logoff', removeUser);
