const socket = window.io();

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();

  const nickname = 'user';
  const chatMessage = document.querySelector('.chatMessage').value;

  if (nickname.length && chatMessage.length) {
    const dateActual = new Date().toLocaleString();
    const formatedData = dateActual.replace(/\//g, '-');

    const sendMessage = {
      chatMessage,
      nickname,
      timestamp: formatedData,
    };

    // enviamos as informacoes para o backend
    socket.emit('message', sendMessage);

    chatMessage.value = '';
  }
});
