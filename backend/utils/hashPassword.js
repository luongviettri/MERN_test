const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
//! sử dụng code sync rất dễ gây chặn event loop===> cần phải dc tối ưu code
const hashPassword = (password) => bcrypt.hashSync(password, salt);
//! tối ưu code---> ko sử dụng sync và phải đặt trong middleware
const comparePasswords = (inputPassword, hashedPassword) =>
  bcrypt.compareSync(inputPassword, hashedPassword);
module.exports = { hashPassword, comparePasswords };
