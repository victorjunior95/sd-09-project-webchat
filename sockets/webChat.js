const moment = require('moment');
const messageModel = require('../models/chat');

moment.defaultFormat = 'DD-MM-yyyy HH:mm:ss'; 

const userList = new Map();
// FEITO COM A TRINCA DE 9 E WAR ROOM JRVM / INSTRUTORES
module.exports = (io) => io.on('connection', async (socket) => {
    const { id } = socket;
    const random = id.slice(0, -4);
    
    socket.on('newUser', () => {
      userList.set(random, random);
      socket.broadcast.emit('newUser', [...userList]);
      socket.emit('online', [...userList]);
    });
    const messageList = await messageModel.getAll();
    io.emit('restoreChat', messageList); 
  
    socket.on('changeName', (nickname) => {
      userList.set(random, nickname);
      io.emit('changeName', [...userList]);
    });
  
    socket.on('message', ({ chatMessage, nickname }) => {
      messageModel.newCreate(chatMessage, userList.get(random) || random, moment().format());
      io.emit('message', `${moment().format()} ${nickname || userList.get(random)}:${chatMessage}`);
    });
  
    socket.on('disconnect', () => { userList.delete(random); io.emit('offline', [...userList]); });
  });
