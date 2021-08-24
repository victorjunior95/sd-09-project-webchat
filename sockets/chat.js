const getDatetimeStr = require('../utils/getDatetimeStr');

module.exports = (io) => io.on('connection', (socket) => {
  let clientNickname = socket.id.toString().slice(0, 16);
  socket.emit('setNickname', clientNickname);
  socket.on('setNickname', (newNickname) => {
    io.emit('message', `${clientNickname} mudou seu nick para ${newNickname}`);
    clientNickname = newNickname;
  });

  socket.on('message', ({ nickname, chatMessage }) => {
    const datetimeStr = getDatetimeStr();
    const messageStr = `${datetimeStr} - ${nickname}: ${chatMessage}`;
    io.emit('message', messageStr);
  });
  
  socket.on('disconnect', () => {
    socket.broadcast.emit('serverMessage', `Xiii! ${socket.id} acabou de se desconectar! :(`);
  });
});
