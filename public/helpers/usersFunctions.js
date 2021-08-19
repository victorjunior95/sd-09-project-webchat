// Fonte: https://qastack.com.br/programming/1349404/generate-random-string-characters-in-javascript
const createNickname = (qtdWorks) => {
  let nickName = '';
  while (nickName.length < qtdWorks) {
    nickName += Math.random().toString(36).substr(2, qtdWorks - nickName.length);
  }
  return nickName;
};

const createMessage = (message) => {
  const messageUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messageUl.appendChild(li);
};

const getDataHora = () => {
  const data = new Date().toLocaleDateString('pt-br').split('/').join('-');
  const hora = new Date().toLocaleTimeString('pt-br');
  return `${data} ${hora}`;
};

const createUser = (ListUsers, ninckname) => {
  const userUl = document.querySelector('#users');  
  const li = document.createElement('li');
  li.innerText = ninckname;
  li.setAttribute('data-testid', 'online-user');
  userUl.appendChild(li);
  li.removeAttribute('data-testid'); // para ficar somente com o usuario que esta naquela página
  ListUsers.forEach((user) => {
    if (user !== ninckname) {
      li.innerText = user;
      userUl.appendChild(li);
    }
  });
};

  module.exports = {
    createNickname,
    createMessage,
    getDataHora,
    createUser,
  };