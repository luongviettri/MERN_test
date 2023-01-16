const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: String,
    address: String,
    country: String,
    zipCode: String,
    city: String,
    state: String,
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
);

//! middleware này dùng để hash password và sau đó xóa đi phần passwordConfirm
userSchema.pre('save', async function (next) {
  //! Only run this function if password was acctually modified

  if (!this.isModified('password')) return next();

  //! Hash the password with cost of 12
  //todo: chỗ này cost = 12---> cost càng lớn thì độ phức tạp hash càng cao
  //todo: bcrypt.hash là async==> phải có await

  this.password = await bcrypt.hash(this.password, 12);

  //! Delete passwordConfirm field so it will not be saved on the database

  this.passwordConfirm = undefined;

  next();
});
//! middleware dùng để tự động ghi lại passwordChangedAt khi đổi mật khẩu
userSchema.pre('save', function (next) {
  //todo1: nếu ko phải là đổi mật khẩu hoặc nếu là tạo mới user thì bỏ qua middleware này

  if (!this.isModified('password') || this.isNew) return next();

  //todo2: set passwordChangedAt ---> và in practice, code này có thể chạy chậm hơn kì vọng vì có thể lưu vào database chậm---> cần phải -1 giây để chắc chắn nó được lưu vào database trước khi token được tạo ra và trả về user

  this.passwordChangedAt = Date.now() - 1000;

  next();
});
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    //! chuyển đơn vị ngày về đơn vị có thể so sánh được với timestamp
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};
//! cái bên dưới gọi là instance method ==> tất cả các document của collection ( hay là tất cả row trong table) đều dùng được
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model('User', userSchema);
module.exports = User;
