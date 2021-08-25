const client = window.io();

const sendMessage = document.querySelector('#sendMessage');
const saveNickname = document.querySelector('#saveNickname');
const messages = document.querySelector('#messages');

let onlineUser;

const createUserName = (users) => {
  document.querySelector('#users').innerHTML = '';
  const firstUser = users.find((user) => user.id === onlineUser.id);
  const othersUsers = users.filter((user) => user.id !== onlineUser.id);
  [firstUser, ...othersUsers].forEach((user) => {
    const li = document.createElement('li');
    if (onlineUser.id === user.id) li.id = 'nickname';
    li.innerHTML = user.nickname;
    li.setAttribute('data-testid', 'online-user'); 
    document.querySelector('#users').appendChild(li);
  });  
};

sendMessage.addEventListener('submit', (event) => {
  event.preventDefault();
  const nickname = document.querySelector('#nickname').innerHTML;
  const chatMessage = document.querySelector('#message-box').value;
  const message = { nickname, chatMessage };   
  client.emit('message', message);
});

saveNickname.addEventListener('submit', (event) => {
  event.preventDefault();
  const nickname = document.querySelector('#nickname');
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

const allMessages = (msgs) => {
  document.querySelector('#messages').innerHTML = ''; 
  msgs.forEach((message) => {        
    const msg = document.createElement('div');
    msg.innerHTML = ` 
      <div class="msg-text" data-testid="message">
        ${message.timestamp} - ${message.nickname}: ${message.message}
      </div>`;  
    document.querySelector('#messages').append(msg);
  });
};

client.on('connectUser', ({ users, msgs }) => {
  createUserName(users);
  allMessages(msgs);
});
client.on('onlineUser', (user) => { onlineUser = user; });
client.on('updateNickname', (users) => { createUserName(users); });
client.on('disconnectClient', (users) => { createUserName(users); });
client.on('message', (message) => messages.append(createMessage(message)));
