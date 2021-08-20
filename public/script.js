const socket = window.io();
const labelName = document.querySelector('#labelName');
const buttonChange = document.querySelector('#changeNickButton');
const inputNickName = document.querySelector('#inputNickName');
const buttonSend = document.querySelector('#sendButton');
const inputMessage = document.querySelector('#inputMessage');

const generateRandomName = () => {
  const randomNumber = parseInt(Math.random() * (1000 - 100) + 100, 10);
  return `usernickname_${randomNumber}`;
};

buttonChange.addEventListener('click', () => {
  const user = document.querySelector(`#${labelName.innerText}`);
  user.innerText = inputNickName.value;
  user.setAttribute('id', inputNickName.value);
  socket.emit('changeNick', {
    oldNick: labelName.innerText,
    newNick: inputNickName.value,
  });
  labelName.innerText = inputNickName.value;
  return false;
});

buttonSend.addEventListener('click', () => {
  socket.emit('message', { nickname: labelName.innerText, chatMessage: inputMessage.value });
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

const addUserInList = (user) => {
  const userList = document.querySelector('#usersList');
  const li = document.createElement('li');
  li.innerText = user;
  li.setAttribute('id', `${user}`);
  li.setAttribute('data-testid', 'online-user');
  if (user === labelName.innerText) {
    userList.prepend(li);
  } else {
    userList.appendChild(li);
  }
};

const changeUserNick = (user) => {
  const guest = document.querySelector(`#${user.oldNick}`);
  guest.innerText = user.newNick;
  guest.setAttribute('id', user.newNick);
};

const removeUser = (user) => {
  const userList = document.querySelector('#usersList');
  for (let index = (userList.children.length - 1); index >= 0; index -= 1) {
    if (userList.children[index].id === user) {
      userList.removeChild(userList.children[index]);
    }
  }
};

window.onload = () => {
  labelName.innerText = generateRandomName();
  addUserInList(labelName.innerText);
  socket.emit('logged', { userName: labelName.innerText });
};

window.onbeforeunload = (_event) => {
  socket.disconnect();
};

socket.on('logout', (user) => removeUser(user));
socket.on('newUser', (user) => addUserInList(user));
socket.on('changeNick', (user) => changeUserNick(user));
socket.on('logged', ({ loggedUsers, messages }) => {
  loggedUsers.forEach((user) => {
    addUserInList(user.userNick);
  });
  messages.forEach((message) => {
    const newMessage = `${message.timestamp} - ${message.nickname}: ${message.chatMessage}`;
    createMessage(newMessage);
  });
});

socket.on('message', (mensagem) => createMessage(mensagem)); 