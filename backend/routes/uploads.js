const multer = require('multer');
const { getUploads, addUpload, updateUpload, deleteUpload } = require('../controller/uploadsController');
const authMiddleware = require('../middleware/auth');
const upload = multer({ dest: 'uploads/' });

module.exports = (app) => {
  app.get('/uploads', authMiddleware, getUploads);
  app.post('/uploads', authMiddleware, upload.single('file'), addUpload);
  app.put('/uploads/:id', authMiddleware, upload.single('file'), updateUpload);
  app.delete('/uploads/:id', authMiddleware, deleteUpload);
};



