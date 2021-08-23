const socket = window.io();

socket.on('newUser', (message) => console.log(message));
