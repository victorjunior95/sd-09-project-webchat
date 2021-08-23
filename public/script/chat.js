const socket = window.io();

const sendButton = document.querySelector('#sendButton');
const inputMessage = document.querySelector('#messageInput');
const nicknameButton = document.querySelector('#nicknameButton');
const inputNickname = document.querySelector('#nicknameBox');

let nickname = '';

nicknameButton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('nicknameChange', inputNickname.value);
  inputNickname.value = '';
  return false;
});

sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: inputMessage.value, nickname });
  inputMessage.value = '';
  return false;
});

// cria um li e coloca abaixo da ul #messages

const newMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

// caso não encontre nenhum nickname, busca o socket.id e pega apenas 16 digitos dele
// não foi possível definir o socket.id diretamente na declaraço da variavel pois a conexao nao havia sido estabelecida ainda

const displayNickname = () => {
  if (!nickname) nickname = socket.id.slice(1, 17);
  const welcomeMessage = nickname;
  const welcomeDiv = document.querySelector('#welcome');
  const p = document.createElement('p');
  p.setAttribute('data-testid', 'online-user');
  p.setAttribute('id', 'onlineUser');
  p.innerText = welcomeMessage;
  welcomeDiv.appendChild(p);
};

const changeNickname = (newNickname) => {
  console.log(nickname);
  nickname = newNickname;
  const userP = document.querySelector('#onlineUser');
  const welcomeMessage = nickname;
  userP.innerText = welcomeMessage;
  return nickname;
};

// Quanto o evento welcome for emitido, a mensagem será tansformada num li pela funcao newMessage
socket.on('welcome', () => displayNickname());
socket.on('online', (message) => newMessage(message));
socket.on('message', (chatMessage) => newMessage(chatMessage));
socket.on('nicknameChange', (newNickname) => changeNickname(newNickname));
