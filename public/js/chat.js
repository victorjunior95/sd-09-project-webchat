const socket = window.io();
const DATA_TESTID = 'data-testid';
const you = document.getElementById('you');
const sendButton = document.getElementById('send-button');
const inputMessage = document.getElementById('chat-input');
const nicknameBox = document.getElementById('nickname-box');
const nicknameButton = document.getElementById('nickname-button');
const messagesArea = document.getElementById('messages');
const userList = document.getElementById('users');
let localNickname = localStorage.getItem('nickname');

if (localNickname) {
  you.innerText = localNickname;
  socket.emit('connected', localNickname);
} else {
  // caso o usuário não esteja salvo, emitir um newUser
  localStorage.setItem('nickname', you.innerText);
  localNickname = you.innerText;
  socket.emit('newUser', localNickname);
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

const appendNewUser = (newUser) => {
  const totalUsers = document.getElementById('total-users');
  totalUsers.innerText = `Users (${[...userList.children].length + 1})`;
  const li = document.createElement('li');
  li.setAttribute(DATA_TESTID, 'online-user');
  li.innerText = `${newUser}`;
  if (newUser === localNickname) {
    return userList.prepend(li);
  }
  return userList.appendChild(li);
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
  userList.childNodes[index].innerText = newNickname;
};

const enteredChatMessage = (newUser) => {
  const newUserMessage = document.createElement('li');
  newUserMessage.classList.add('new-user');
  newUserMessage.innerText = `${newUser} has entered the chat`;
  return messagesArea.appendChild(newUserMessage);
};

socket.on('connected', ({ newUser }) => {
  appendNewUser(newUser);
  enteredChatMessage(newUser);
});

socket.on('message', (message) => {
  appendNewMessage(message);
});

socket.on('newNickname', (nicknames) => appendNewNickname(nicknames));

socket.on('disconnect', socket.emit('disconnec', you.innerText));
