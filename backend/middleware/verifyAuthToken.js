const jwt = require('jsonwebtoken');

//! hàm này vẫn còn thiếu điều kiện user đã bị xóa hoặc user đã đổi mật khẩu--> cần tối ưu code
const verifyIsLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    //! nếu ko có token
    if (!token) {
      return res.status(403).send('A token is required for authentication');
    }
    //! nếu có token thì decode
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).send('Unauthorized. Invalid Token');
    }
  } catch (error) {
    next(error);
  }
};
//! hàm này có thể tối ưu code hơn là gán cứng admin
const verifyIsAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).send('Unauthorized. Admin required');
  }
};

module.exports = { verifyIsLoggedIn, verifyIsAdmin };
