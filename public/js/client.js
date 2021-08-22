const client = window.io();

const sendMessage = document.querySelector('#sendMessage');
const saveNickname = document.querySelector('#saveNickname');
const messages = document.querySelector('.messages');

const createUserName = (user) => {
  const users = document.querySelector('.users');
  const li = `<li class="nickname" data-testid="online-user">${user}</li>`;    
  users.innerHTML = li;
};

sendMessage.addEventListener('submit', (event) => {
  event.preventDefault();
  const nickname = document.querySelector('.nickname').innerHTML;
  const chatMessage = document.querySelector('#message-box').value;
  const message = { nickname, chatMessage };   
  client.emit('message', message);
});

saveNickname.addEventListener('submit', (event) => {
  event.preventDefault();
  const nickname = document.querySelector('.nickname');
  const newNickname = document.querySelector('#nickname-box').value;
  nickname.innerText = newNickname;
  client.emit('nickname', newNickname);
});

const createMessage = (message) => {
  const msg = document.createElement('div');
  const msgComponent = ` 
    <div class="message" data-testid="message">
      ${message}
    </div>`;
  msg.innerHTML = msgComponent;  
  return msg;
};

client.on('connectUser', (user) => createUserName(user));
client.on('message', (message) => messages.append(createMessage(message)));
