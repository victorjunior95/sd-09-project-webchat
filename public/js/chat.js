const socket = window.io();

window.onload = () => {
  socket.emit('updateOnlineUsers');
};

const formMessage = document.querySelector('#form-message');
const inputMessage = document.querySelector('#input-message');
const formNickname = document.querySelector('#form-nickname');
const inputNickname = document.querySelector('#input-nickname');

formNickname.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nickname = inputNickname.value;
  // sessionStorage.setItem('nickname', nickname);

  socket.emit('updateNickname', nickname);

  inputNickname.value = '';
  
  return false;
});

formMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nickname = socket.id.slice(0, -4);
  const chatMessage = inputMessage.value;

  // console.log(nickname);

  socket.emit('message', {
    nickname,
    chatMessage,
  });

  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  // const { timestamp, nickname, chatMessage } = message;
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  // li.innerText = `${timestamp} ${nickname}: ${chatMessage}`;
  li.innerText = message;
  messagesUl.appendChild(li);
};

const createUserList = (users) => {
  let userList = [];
  const usersUl = document.querySelector('#online-users');
  usersUl.innerHTML = '';
  
  if (users[users.length - 1].id === socket.id) {
    const onlineUser = users[users.length - 1];
    users.pop();
    userList = [onlineUser, ...users];
  } else {
    userList = users;
  }

  userList.map((user) => {
    // console.log(user);
    const userLi = document.createElement('li');
    userLi.setAttribute('data-testid', 'online-user');
    // console.log(user);
    const { nickname } = user;
    userLi.innerText = nickname;
    usersUl.appendChild(userLi);
    return false;
  });
};

socket.on('onlineUsers', (users) => createUserList(users));
socket.on('message', (messageObj) => createMessage(messageObj));
socket.on('retryMessages', (messageData) => {
  messageData.map((messageObj) => {
    if (messageObj.chatMessage) {
      const { timestamp, nickname, chatMessage } = messageObj;
      createMessage(`${timestamp} ${nickname}: ${chatMessage}`);
    }
    return 0;
  });
});
