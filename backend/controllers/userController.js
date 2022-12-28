const { ObjectId } = require('mongodb');
const User = require('../models/UserModel');
const Review = require('../models/ReviewModel');
const { hashPassword, comparePasswords } = require('../utils/hashPassword');
const generateAuthToken = require('../utils/generateAuthToken');
const Product = require('../models/ProductModel');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password'); //! cần sửa lại đoạn này để tối ưu code ---> sửa lại trong user model---> ngay field password---> select: false, và bỏ phần select ở đây
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, lastName, email, password } = req.body;
    //! nếu thiếu required fields
    if (!(name && lastName && email && password)) {
      return res.status(400).send('All inputs are required');
    }

    const userExists = await User.findOne({ email });
    //!nếu trùng email
    if (userExists) {
      return res.status(400).send('user exists');
    }

    //! tạo new user. ko thực tế vì user model ko có phần nhập lại mật khẩu để so sánh
    //todo: hash password trước khi tạo, phần hash này cần đặt trong user model để tối ưu code
    const hashedPassword = hashPassword(password);
    //todo: tạo user với password đã được hash
    const user = await User.create({
      name,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    //! JWT
    const JWTtoken = generateAuthToken(
      user._id,
      user.name,
      user.lastName,
      user.email,
      user.isAdmin
    );
    //! cookieOptions
    const cookieOptions = {
      //todo: attributes của cookie, cần đọc doc thêm, căn bản là tăng secure
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };
    //! gửi về user
    res
      //! cookie được tạo để sau này tự động log in ở phía front-end
      .cookie('access_token', JWTtoken, cookieOptions)
      .status(201)
      .json({
        //! chỗ này cần tối ưu code, mục đích của đoạn code này chỉ để tránh hiển thị password--> tối ưu trong user model
        success: 'User created',
        userCreated: {
          _id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password, doNotLogout } = req.body;
    //! nếu ko có email hoặc pass dc gửi lên
    if (!(email && password)) {
      return res.status(400).send('All inputs are required');
    }
    const user = await User.findOne({ email });
    if (user && comparePasswords(password, user.password)) {
      //! xử lí so sánh password
      //something here
      //! cookieOptions
      let cookieParams = {
        //todo: attributes của cookie, cần đọc doc thêm, căn bản là tăng secure
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      };
      //! ghi nhớ log in
      if (doNotLogout) {
        const timeLogin = 1000 * 60 * 60 * 24 * 7; //! 7 days
        cookieParams = { ...cookieParams, maxAge: timeLogin }; // 1000=1ms
      }
      return res
        .cookie(
          'access_token',
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin
          ),
          cookieParams
        )
        .json({
          success: 'user logged in',
          userLoggedIn: {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            doNotLogout,
          },
        });
    }
    return res.status(401).send('wrong credentials');
  } catch (error) {
    console.log(
      'nhay vo day------------------------------------------------------------------'
    );
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userID = req.user._id;

    const user = await User.findById(userID).orFail();
    //! phải gán lại tất cả vì là hàm PUT, có thể tối ưu = hàm patch, nhưng gán cả password thì ko thực tế, có thể tối ưu = cách tạo ra một route riêng để xử lí quên mật khẩu, và nên xử lí isModified trong userModel
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber;
    user.address = req.body.address;
    user.country = req.body.country;
    user.zipCode = req.body.zipCode;
    user.city = req.body.city;
    user.state = req.body.state;
    //! chỗ đổi cả mật khẩu thế này ko thực tế
    if (req.body.password !== user.password) {
      user.password = hashPassword(req.body.password);
    }

    await user.save();

    res.json({
      success: 'user updated',
      userUpdated: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    return res.send(user);
  } catch (error) {
    next(error);
  }
};
//! đoạn tính trung bình điểm review có thể thay thế = hàm static trong model
const writeReview = async (req, res, next) => {
  //! chỗ này cần phải tạo review ID = tay bởi vì database ko có sự liên kết giữa review và product---> tối ưu code = cách sửa lại database có thêm phần tham chiếu từ review đến product.
  try {
    const session = await Review.startSession(); //! Review.startSession() trả về 1 promise session, mục đích: để tránh trường hợp review đã tạo nhưng ko thuộc về product nào ( 2 excution phải đều đc hoàn thành nếu, session cho phép quay lại ban đầu nếu 1 trong 2 ko hoàn thành)

    //! get comment, rating from request.body:
    const { comment, rating } = req.body;
    //! validate request:
    if (!(comment && rating)) {
      return res.status(400).send('All inputs are required');
    }
    //! create review id manually because it is needed also for saving in Product collection
    const reviewId = ObjectId();

    session.startTransaction(); //! bắt đầu một transaction
    await Review.create(
      [
        {
          _id: reviewId,
          comment: comment,
          rating: Number(rating),
          user: {
            _id: req.user._id,

            name: `${req.user.name} ${req.user.lastName}`,
          },
        },
      ],
      { session: session }
    );

    //! tìm product dựa vào productID được gửi lên từ client
    const product = await Product.findById(req.params.productId)
      .populate('reviews')
      .session(session); //! Sets the MongoDB session associated with this query

    //! nếu user review rồi thì ko cho review nữa, chỗ này có thể tối ưu = compoundIndex với unique property thay vì code tay như thế này
    const alreadyReviewed = product.reviews.find(
      (r) => r.user._id.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      await session.abortTransaction(); //! nếu nhảy vào đây thì loại bỏ transaction
      session.endSession(); //! sau đó đóng session. ( session chứa transaction )
      return res.status(400).send('product already reviewed');
    }

    let prc = [...product.reviews]; //! tọa mảng dùng cho mục đích tính trung bình điểm review
    prc.push({ rating: rating }); //! push object {rating: 5} vào mảng reviews--> mục đích là để tính trung bình rating khi gọi hàm map---> mảng chỉ dùng tạm nên ko cần các object giống nhau

    //! tính điểm review
    product.reviews.push(reviewId);

    if (product.reviews.length === 1) {
      product.rating = Number(rating);
      product.reviewsNumber = 1;
    } else {
      product.reviewsNumber = product.reviews.length;
      product.rating =
        prc
          .map((item) => Number(item.rating))
          .reduce((sum, item) => sum + item, 0) / product.reviews.length;
    }
    await product.save();

    await session.commitTransaction(); //! nếu chạy được đến đây thì mới đem cả transaction này đi xử lí
    session.endSession(); //! đóng session
    //! gửi về client
    res.send('review created');
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name lastName email isAdmin')
      .orFail();
    return res.send(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    await user.save();

    res.send('user updated');
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail(); //! có thể thay thế = findByIdAndDelete
    await user.remove();
    res.send('user removed');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  writeReview,
  getUser,
  updateUser,
  deleteUser,
};
