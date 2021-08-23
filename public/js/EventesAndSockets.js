const socket = window.io();
const nickDiv = '.nickNames';
const { $ } = window;

// ------------------------------------------------------------------------------------------//
const adjectives = [
  'lord', 'master', 'adorable', 'short', 'kind', 'tired', 'caring', 'fearless', 'funny',
  'joyful', 'friendly', 'tall', 'short', 'handsome', 'determined', 'smart', 'studious', 'faithful',
  'handy', 'honest', 'naive', 'insecure', 'fair', 'modest', 'neurotic', 'optimistic', 'daring',
  'patient', 'romantic', 'nice', 'lucky', 'talented', 'shy'];

const names = ['Carla', 'Tom', 'Jay', 'Martin', 'Sharon', 'Gustav', 'Wesley', 'Harry', 'Victor',
  'Lorran', 'Brayan', 'Giulia', 'Karine', 'Ingrid', 'Yasmin', 'Emilly', 'Samara', 'Lilian',
  'Ashley', 'Agatha', 'Hellen', 'Arna', 'Alyssa'];

const getNickName = () => {
  const random = (num) => Math.floor(Math.random() * num);
  const randomAdj = adjectives[random(adjectives.length)];
  const randonName = names[random(names.length)];
  let nick = `${randomAdj}${randonName}`;
  while (nick.length < 16) {
    nick += random(9);
  }
  return nick;
};
// ------------------------------------------------------------------------------------------//

let myNickName = getNickName();

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
