const socket = window.io();

const userForm = document.querySelector('.login-form');
const inputUser = document.querySelector('#loginInput');
const messageForm = document.querySelector('.message-form');
const inputMessage = document.querySelector('#messageInput');
const usersUl = document.querySelector('.usersList');
const messagesUl = document.querySelector('.chat-messages');

socket.emit('randomNick');

userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = inputUser.value;
  socket.emit('clientLogin', user);
});

const createNewUser = (userName) => {
  const li = document.createElement('li');
  li.innerHTML = userName;
  li.setAttribute('data-testid', 'online-user');
  usersUl.appendChild(li);
  return li;
};

socket.on('serverLogin', (userName) => createNewUser(userName));

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = inputMessage.value;
  socket.emit('message', { chatMessage });
  inputMessage.value = '';
});

const createMessage = (chatMessage) => {
  console.log(chatMessage);
  const li = document.createElement('li');
  li.innerHTML = chatMessage;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

socket.on('online', (usersList) => {
  Object.values(usersList).forEach((user) => {
    usersUl.appendChild(createNewUser(user));
  });
});

socket.on('updateUsers', ({ usersList }) => {
  usersUl.innerHTML = '';
  const firstUser = Object.keys(usersList).find((user) => user === socket.id.toString());
  const users = Object.values(usersList).filter((user) => user !== usersList[firstUser]);
  const list = [usersList[firstUser], ...users];
  list.forEach((user) => {
    usersUl.appendChild(createNewUser(user));
  });
});

socket.on('updateMessage', (messageHistory) => {
  messageHistory.forEach(({ timestamp, nickname: name, message }) => {
    const messageInfo = `${timestamp} - ${name}: ${message}`;
    createMessage(messageInfo);
  });
});

socket.on('message', (chatMessage) => createMessage(chatMessage));

window.onbeforeunload = () => {
  socket.disconnect();
};