const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser()); //! dùng để phân tích cookie từ client gửi lên
app.use(fileUpload()); //! dùng để thực hiện upload ảnh

app.get('/', async (req, res, next) => {
  res.json({ message: 'API running...' });
});

//! mongoDB connection
connectDB();

app.use('/api', apiRoutes);

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
