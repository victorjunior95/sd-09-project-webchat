// const moment = require('moment');

const webchatModel = require('../models/Webchat');

const view = (_req, res, _next) => res.render('Webchat');

const registerSocket = async (msg) => {
  const { message, nickname, timestamp } = msg;
  // const timestamp = moment().format('yyy-MM-DD HH:mm:ss');
  await webchatModel.register({ message, nickname, timestamp });
};

const getAllMessages = async () => webchatModel.getAll();

module.exports = {
  view,
  registerSocket,
  getAllMessages,
};
