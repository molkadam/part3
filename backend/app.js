const express = require('express');
const cookieParser = require('cookie-parser');
const usersRoutes = require('./routes/users');
const uploadsRoutes = require('./routes/uploads');
const chatsRoutes = require('./routes/chats');
const upload = require('./utils/formParser');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

usersRoutes(app);
uploadsRoutes(app);
chatsRoutes(app);
app.get("/", (req, res) => {
  res.send("Welcome to our server!"); // or any other response you want to send
});
// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ fileName: req.file.filename, filePath: `/uploads/${req.file.filename}` });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
