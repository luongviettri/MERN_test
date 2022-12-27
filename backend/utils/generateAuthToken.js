const jwt = require('jsonwebtoken');

const generateAuthToken = (_id, name, lastName, email, isAdmin) => {
  return jwt.sign(
    { _id, name, lastName, email, isAdmin }, //!bình thường chỉ cần ID
    process.env.JWT_SECRET_KEY,
    { expiresIn: '7h' } //! thời gian hết hạn
  );
};

module.exports = generateAuthToken;
