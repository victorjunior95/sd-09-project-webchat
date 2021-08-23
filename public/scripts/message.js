const renderMessage = (message, myId, messageUserId) => {
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
  span.setAttribute('data-testid', 'message');
  //  WhatsApp Version
  // span.innerText = chatMessage;

  //  Project Version
  span.innerText = message;
  messageDiv.appendChild(span);

  messagesBox.appendChild(messageDiv);
};

module.exports = {
  renderMessage,
};