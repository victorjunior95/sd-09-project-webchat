const client = window.io();
// const randomstring = require('randomstring');

const form = document.querySelector('#form-message');
const textBox = document.querySelector('#input-message');
const buttonNickname = document.querySelector('#nickname-button');
let nickname = Math.random().toString().substring(2, 18);
const dataTestId = 'data-testid';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = textBox.value;
  client.emit('message', { nickname, chatMessage });
  textBox.value = '';

  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute(dataTestId, 'message');
  messagesUl.appendChild(li);
};

const updateNickname = () => {
  const inputNickname = document.querySelector('#input-nickname');
  nickname = inputNickname.value;
  client.emit('updateNickname', inputNickname.value);
  // const userUl = document.querySelector('[data-testid="online-user"]');
  // userUl.innerText = inputNickname.value;
  inputNickname.value = '';
};

buttonNickname.addEventListener('click', () => updateNickname());

client.emit('handleNickname', nickname);

const clientsList = (clients) => {
  const userUl = document.querySelector('#users-list');
  userUl.innerHTML = '';
  clients.forEach((clientObj) => {
    const li = document.createElement('li');
    li.innerText = clientObj.nickname;
    li.setAttribute(dataTestId, 'online-user');
    userUl.appendChild(li);
  });
};

const createHistory = (messageObj) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = `${messageObj.timestamp} ${messageObj.nickname} ${messageObj.message} `;
  li.setAttribute(dataTestId, 'message');
  messagesUl.appendChild(li);
};

client.on('handleNickname', (clients) => {
  let orderedClients = clients.filter((name) => name.id !== client.id);
  orderedClients = [{ nickname }, ...orderedClients];
  clientsList(orderedClients);
});
client.on('message', ((message) => createMessage(message)));
client.on('history', ((messages) => messages.forEach((message) => createHistory(message))));
client.on('clientExit', ((clients) => clientsList(clients)));