const { getUsers, getUsersById, registerUser, updateUser, deleteUser, loginUser } = require('../controller/usersController');
const authMiddleware = require('../middleware/auth');

module.exports = (app) => {
  app.get('/users', authMiddleware, getUsers);
  app.get('/users/:id', authMiddleware, getUsersById);
  app.post('/users', registerUser);
  app.put('/users/:id', authMiddleware, updateUser);
  app.delete('/users/:id', authMiddleware, deleteUser);
  app.post('/login', loginUser);
};
