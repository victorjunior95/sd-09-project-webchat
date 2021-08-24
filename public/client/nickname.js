const nicknameSocket = window.io();

const USER = '#online-user';

const nicknameForm = document.querySelector('#nickname-form');
const newNickname = document.querySelector('#nickname-text');
const nicknameList = document.querySelector('#online-list');

const createNickname = (nickname, user) => {
  const online = nicknameList.children.namedItem(nickname);
  if (!online) {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.setAttribute('name', nickname);
    if (user) li.setAttribute('id', 'online-user');
    li.innerText = nickname;
    nicknameList.appendChild(li);
  }
};

const updateNickname = (nickname) => {
  const li = document.querySelector(USER);
  li.innerText = nickname;
  li.setAttribute('name', nickname);
};

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const oldNickname = document.querySelector(USER).innerText;
  nicknameSocket.emit('nicknameChange', { nickname: newNickname.value, oldNickname });
  newNickname.value = '';
  return false;
});

nicknameSocket.on('nickname', (nickname) => {
  createNickname(nickname, true);
});

nicknameSocket.on('nicknameChange', (nickname) => {
  updateNickname(nickname);
});

nicknameSocket.on('otherUserNicknameChange', (oldNickname, nickname) => {
  const li = nicknameList.children.namedItem(oldNickname);
  li.innerText = nickname;
  li.setAttribute('name', nickname);
});

nicknameSocket.on('onlineCheck', () => {
  setTimeout(() => '', Math.random() * 100);
  const nickname = document.querySelector(USER).innerText;
  nicknameSocket.emit('onlineUser', { nickname });
});

nicknameSocket.on('onlineUser', (nickname) => createNickname(nickname, false));

nicknameSocket.on('offlineUser', (nickname) => {
  const offline = nicknameList.children.namedItem(nickname);
  nicknameList.removeChild(offline);
});

window.onbeforeunload = () => {
  const nickname = document.querySelector(USER).innerText;
  nicknameSocket.emit('end', { nickname });
  nicknameSocket.disconnect();
};
