const socket = window.io();
const nickDiv = '.nickNames';
const { $ } = window;

let myNickName = localStorage.getItem('MyNickName');

const renderMessage = (message) => {
  $('.messages').append(
    `<div data-testid="message"  class="message">
    ${message}
    </div>`,
  );
};

const renderNickNames = (username) => {
  $(nickDiv).append(
    `<div class="message">
      <strong data-testid="online-user">${username}</strong>
      </div>`,
  );
};
renderNickNames(myNickName);

socket.on('previousNames', (nicks) => {
  nicks.forEach((nick) => {
    renderNickNames(nick);
  });
});

socket.on('message', (message) => {
  renderMessage(message);
});

socket.on('receivedNames', (receivedNames) => {
  $(nickDiv).empty();
  renderNickNames(myNickName);
  const nicknames = receivedNames;
  nicknames.splice(nicknames.indexOf(myNickName), 1);
  nicknames.forEach((element) => {
    renderNickNames(element);
  });
});

socket.on('nickname', () => {
  socket.emit('sendName', [myNickName, socket.id]);
});

const caputureMessageButton = () => {
  $('.send-message').on('click', () => {
    const nickname = myNickName;
    const chatMessage = $('input[name=message]').val();
    const messageObject = {
      chatMessage, nickname,
    };
    socket.emit('message', messageObject);
  });
};

const caputureNickNameButton = () => {
  $('.namesButton').on('click', () => {
    $(nickDiv).empty();
    const oldName = myNickName;
    const newName = $('input[name=username]').val();
    myNickName = newName;
    renderNickNames(myNickName);
    socket.emit('changeName', { oldName, newName });
  });
};

socket.on('previousMessage', (messages) => {
  caputureMessageButton();
  caputureNickNameButton();
  messages.forEach((element) => {
    renderMessage(element.message);
  });
});
