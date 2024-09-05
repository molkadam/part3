const { getChats, addChat } = require('../controller/chatsController');
const authMiddleware = require('../middleware/auth');

module.exports = (app) => {
  app.get('/chats', authMiddleware, getChats);
  app.post('/chats', authMiddleware, addChat);
  app.post('/users', authMiddleware);
};
