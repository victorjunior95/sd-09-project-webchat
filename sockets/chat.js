const moment = require('moment');

const createTimestamp = moment().format('DD-MM-yyyy HH:mm:ss');

const getMessageFormat = ({ chatMessage, nickname }) => {
  const timestamp = createTimestamp;
  return `${timestamp} - ${nickname}: ${chatMessage}`;
};

const chatConfig = async (io, socket) => {
  socket.on('message', async (data) => {
    const formatedMsg = await getMessageFormat(data);
    io.emit('message', formatedMsg);
  });
};

module.exports = (io) => {
  io.on('connection', async (socket) => {
    await chatConfig(io, socket);
  });
};