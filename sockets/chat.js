const formatedMessage = (nickname, chatMessage) => {
  const dateActual = new Date().toLocaleString();
  const formatedData = dateActual.replace(/\//g, '-');
  return `${formatedData} - ${nickname}: ${chatMessage}`;
};

module.exports = (io) =>
  io.on('connection', (socket) => {
    console.log(`Usuário conectado. ID: ${socket.id} `);

    // recebe as mensagens do frontend
    socket.on('message', (message) => {
      const messageString = formatedMessage(
        message.nickname,
        message.chatMessage,
      );

      // retorna a mensagem para todos os usuarios conectados
      io.emit('message', messageString);
    });
  });
