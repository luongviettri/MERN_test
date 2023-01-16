const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');

//! hàm này vẫn còn thiếu điều kiện user đã bị xóa hoặc user đã đổi mật khẩu--> cần tối ưu code
const verifyIsLoggedIn = catchAsync(async (req, res, next) => {
  const token = req.cookies.access_token;
  //! 1. Kiểm tra nếu ko có token
  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  //! 2. Xác thực xem token có phải do server tạo không
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  //! 3) Check if user still exits ( nghĩa nếu user tạo xong và được cấp cho token rồi nhưng user sau đó đã bị xóa thì cũng từ chối token đó )
  const currentUser = await User.findById(decoded._id);

  if (!currentUser) {
    return res.status(403).send('Người dùng không còn tồn tại');
  }

  //!  //! 4)Check if user changed password after the token was issued (tức là nếu lỡ người nào biết được mật khẩu cũ này và cố tình dùng nó để đăng nhập thì vẫn đăng nhập dc==> ko ổn===> phải tránh trường hợp này)

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(403).send('Mật khẩu không còn hợp lệ');
  }

  req.user = decoded;
  next();
});
//! hàm này có thể tối ưu code hơn là gán cứng admin
const verifyIsAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).send('Unauthorized. Admin required');
  }
};

module.exports = { verifyIsLoggedIn, verifyIsAdmin };
