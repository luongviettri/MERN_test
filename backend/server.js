require('dotenv').config();
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const Redis = require('redis');

const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const redisClient = Redis.createClient();

const app = express();

app.use(helmet()); //!  Security HTTP headers

//! start chống tấn công bruce attack
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Quá nhiều request, thử lại sau 1 giờ nữa',
});
app.use('/api', limiter);
//! end chống tấn công bruce attack

const httpServer = createServer(app);
global.io = new Server(httpServer);

//! start thực hiện xử lý body dc gửi từ client, 1 là limit 10kb, 2 là lọc dữ liệu
app.use(express.json({ limit: '10kb' })); //*: body parser, đọc dữ liệu data từ body và đưa vào req.body

//todo: lọc dữ liệu để chống noSQL query injection
app.use(mongoSanitize());
//todo: lọc dữ liệu để chống XSS
app.use(xss());

//! end

app.use(cookieParser()); //! dùng để phân tích cookie từ client gửi lên
app.use(fileUpload()); //! dùng để thực hiện upload ảnh

const admins = [];
let activeChats = [];
// eslint-disable-next-line no-unused-vars, camelcase
function get_random(array) {
  return array[Math.floor(Math.random() * array.length)];
}

app.use(hpp()); //! prevent parameter pollution để tránh lặp code trên url dẫn đến crash application, có thể thêm whitelist nhưng ko cần  vì ko có trường hợp nào url cần duplicate thuộc tính, nhưng để làm query đơn giản thì phải làm giống app tour thay vì tạo mảng và query

// eslint-disable-next-line no-undef
io.on('connection', (socket) => {
  //! để nhận biết có admin nào ko
  socket.on('admin connected with server', (adminName) => {
    admins.push({ id: socket.id, admin: adminName });
  });
  //! lắng nghe message từ client gửi lên ---> phát ra tín hiệu tới toàn bộ client trừ sender
  socket.on('client sends message', (msg) => {
    if (admins.length === 0) {
      socket.emit('no admin', '');
    } else {
      // eslint-disable-next-line no-shadow
      let client = activeChats.find((client) => client.clientId === socket.id);
      let targetAdminId;
      if (client) {
        targetAdminId = client.adminId;
      } else {
        let admin = get_random(admins);
        activeChats.push({ clientId: socket.id, adminId: admin.id });
        targetAdminId = admin.id;
      }
      socket.broadcast
        .to(targetAdminId)
        .emit('server sends message from client to admin', {
          user: socket.id,
          message: msg,
        });
    }
  });
  //! lắng nghe message từ admin và phát tín hiệu đến toàn bộ client trừ admin
  socket.on('admin sends message', ({ user, message }) => {
    socket.broadcast
      .to(user)
      .emit('server sends message from admin to client', message);
  });
  socket.on('admin closes chat', (socketId) => {
    socket.broadcast.to(socketId).emit('admin closed chat', '');
    // eslint-disable-next-line no-undef
    let c = io.sockets.sockets.get(socketId);
    c.disconnect(); // reason:  server namespace disconnect
  });
  //! để nghe nếu có event disconnect thì trừ ra trong mảng admin
  socket.on('disconnect', (reason) => {
    // admin disconnected
    const removeIndex = admins.findIndex((item) => item.id === socket.id);
    if (removeIndex !== -1) {
      admins.splice(removeIndex, 1);
    }
    activeChats = activeChats.filter((item) => item.adminId !== socket.id);

    // client disconnected
    const removeIndexClient = activeChats.findIndex(
      (item) => item.clientId === socket.id
    );
    if (removeIndexClient !== -1) {
      activeChats.splice(removeIndexClient, 1);
    }
    socket.broadcast.emit('disconnected', {
      reason: reason,
      socketId: socket.id,
    });
  });
});

//! mongoDB connection
connectDB();

app.use('/api', apiRoutes);

if (process.env.NODE_ENV === 'production') {
  //! đoạn  này để deploy
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'API running...' });
  });
}

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }
  next(error);
});

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  } else {
    //! ko hiển thị stack trên production vì stack contains sensitive informations
    res.status(500).json({
      message: error.message,
    });
  }
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
