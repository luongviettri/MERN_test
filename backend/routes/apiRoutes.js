const express = require('express');

const app = express();
const jwt = require('jsonwebtoken');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');
const orderRoutes = require('./orderRoutes');
const categoryRoutes = require('./categoryRoutes');

//! tìm cách tối ưu hóa route này ? có cần gọi API để xóa cookie ?
app.get('/logout', (req, res) => {
  console.log('Vô đây để xóa cookie');
  return res.clearCookie('access_token').send('access token cleared');
});

//! tìm cách tối ưu hóa route này ?
app.get('/get-token', (req, res) => {
  try {
    // eslint-disable-next-line dot-notation
    const accessToken = req.cookies['access_token'];
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    return res.json({ token: decoded.name, isAdmin: decoded.isAdmin });
  } catch (err) {
    return res.status(401).send('Unauthorized. Invalid Token');
  }
});

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

module.exports = app;
