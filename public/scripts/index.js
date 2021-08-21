const socket = window.io();
let myId;

const getSendMessageInput = () => document.querySelector('#message-to-send');

const createNewMessage = (data) => {
  const { message, messageUserId } = data;
  const messagesBox = document.querySelector('#messages-box');
  // Message div
  const messageDiv = document.createElement('div');
  if (myId === messageUserId) {
    messageDiv.className = 'message my';
  } else {
    messageDiv.className = 'message other';
  }

  //  Message span
  const span = document.createElement('span');
  span.innerText = message;
  messageDiv.appendChild(span);

  messagesBox.appendChild(messageDiv);
};

const clearSendMessageInput = () => {
  getSendMessageInput().value = '';
};

const sendMessage = () => {
  const messageToSend = document.querySelector('#message-to-send').value;
  if (messageToSend === '') return;
  console.log(messageToSend);
  socket.emit('sendMessage', { messageUserId: myId, message: messageToSend });
  clearSendMessageInput();
};

const sendButtonListener = () => {
  const button = document.querySelector('#message-send');
  button.addEventListener('click', sendMessage);
};

const sendEnterListener = () => {
  const input = getSendMessageInput();
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
};

sendEnterListener();
sendButtonListener();

socket.emit('ping');
socket.on('newMessage', (data) => createNewMessage(data));
socket.on('myId', (id) => {
  myId = id;
  console.log(myId);
});
