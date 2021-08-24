const nicknameSocket = window.io();

const nicknameForm = document.querySelector('#nickname-form');
const newNickname = document.querySelector('#nickname-text');
const nicknameList = document.querySelector('#online-list');

const createNickname = (nickname) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.setAttribute('id', 'online-user');
  li.innerText = nickname;
  nicknameList.appendChild(li);
};

const saveNickname = (nickname) => {
  localStorage.setItem('nickname', nickname);
};

const updateNickname = (nickname) => {
  const li = document.querySelector('#online-user');
  li.innerText = nickname;
};

nicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  nicknameSocket.emit('nicknameChange', { nickname: newNickname.value });
  newNickname.value = '';
  return false;
});

nicknameSocket.on('nickname', (nickname) => {
  createNickname(nickname);
  saveNickname(nickname);
});

nicknameSocket.on('nicknameChange', (nickname) => {
  updateNickname(nickname);
  saveNickname(nickname);
});
