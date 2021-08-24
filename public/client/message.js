const messageSocket = window.io();

const messageForm = document.querySelector('#message-form');
const newMessage = document.querySelector('#message-text');
const messageList = document.querySelector('#message-list');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nickname = localStorage.getItem('nickname') || 'Stranger';
  messageSocket.emit('message', { chatMessage: newMessage.value, nickname });
  newMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messageList.appendChild(li);
};

messageSocket.on('message', (message) => createMessage(message));
