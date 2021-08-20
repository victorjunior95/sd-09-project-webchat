// adriano me ajudou com essa função
// github.com/adrianoforcellini
const date = () => {
  const d = new Date();
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}
  ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};

const nickNames = [];
// eslint-disable-next-line max-lines-per-function
module.exports = (io) => {
  io.on('connection', async (socket) => {
    socket.emit('nickname');
    socket.on('nickname', (data) => {
      nickNames.push(data);
      socket.emit('name', data);
      socket.emit('allNickNames', nickNames);
      socket.broadcast.emit('allNickNames', nickNames);
    });
    socket.on('changeName', (obj) => {
      const { nickname, newName } = obj;
      nickNames.splice(nickNames.indexOf(nickname), 1, newName);
      socket.emit('allNickNames', nickNames);
      socket.broadcast.emit('allNickNames', nickNames);
    });
    socket.on('message', (data) => {
      const novaData = `${date()} ${data.nickname}:${data.chatMessage}`;
      socket.broadcast.emit('message', novaData);
      socket.emit('message', novaData);
    });
  });
};
