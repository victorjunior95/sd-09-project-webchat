const moment = require('moment');

const formatMessage = (chatMessage, nickname) => {
  const date = moment().format('DD-MM-yyyy HH:mm');
  return `${date} - ${nickname}: ${chatMessage}`;
};

module.exports = formatMessage;