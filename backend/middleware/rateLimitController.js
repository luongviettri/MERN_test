const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const fs = require('fs');
const Redis = require('ioredis');
const passport = require('passport');
const User = require('../models/UserModel');
const generateAuthToken = require('../utils/generateAuthToken');

//! create a Redis client - connect to Redis (will be done later in this tutorial)

// const redisClient = new Redis();

const redisClient = redis.createClient({
  host: 'redis-10505.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
  port: 10505,
  password: '8s0eGnLgeqiWpqdm1ARlUsl5FkGbLZAg',
  enableOfflineQueue: false,
}); //! tạm thời để cái này

//! nếu không có kết nối đến redis server thì quăng lỗi ra
redisClient.on('error', (err) => {
  console.log('có lỗi với redisssssss');
  //todo: this error is handled by an error handling function that will be explained later in this tutorial
  return new Error();
});
const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByEmailAndIP = 10;

//! tạo 2 đối tượng đếm và giới hạn số lần login failed
const limiterSlowBruteByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_ip_per_day',

  //todo: số lượng point cho phép. 1 fail = 1 point ( mỗi lần fail sẽ consume 1 point )

  points: maxWrongAttemptsByIPperDay,

  //todo: delete key after 24 hours

  duration: 60 * 60 * 24,

  //todo: number of seconds to block route if consumed points > points

  blockDuration: 60 * 60 * 24, //todo: Block for 1 day, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByEmailAndIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_consecutive_email_and_ip',
  points: maxConsecutiveFailsByEmailAndIP,
  duration: 60 * 60, // Delete key after 1 hour
  blockDuration: 60 * 60, // Block for 1 hour
});

//! create key string
const getEmailIPkey = (email, ip) => `${email}_${ip}`;

//! rate-limiting middleware controller
exports.loginRouteRateLimit = async (req, res, next) => {
  const ipAddr = req.ip;
  console.log('ipAddr: ', ipAddr);
  const emailIPkey = getEmailIPkey(req.body.email, ipAddr);

  //todo: get keys for attempted login
  const [resEmailAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByEmailAndIP.get(emailIPkey),
    limiterSlowBruteByIP.get(ipAddr),
  ]);

  let retrySecs = 0; // * số giây để xác định khi nào một user có thể thử đăng nhập lại
  //todo: Kiểm tra nếu IP or email + IP đã đang bị block
  if (
    resSlowByIP !== null &&
    resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
  ) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1; //* ra số giây còn lại hoặc 1
  } else if (
    resEmailAndIP !== null &&
    resEmailAndIP.consumedPoints > maxConsecutiveFailsByEmailAndIP
  ) {
    retrySecs = Math.round(resEmailAndIP.msBeforeNext / 1000) || 1; //* ra số giây còn lại hoặc 1
  }

  //todo: the IP and email không bị giới hạn
  //*: nếu bị giới hạn
  if (retrySecs > 0) {
    //* sets the response’s HTTP header field
    res.set('Retry-After', String(retrySecs));
    res.status(429).send(`Vui lòng thử lại sau ${retrySecs} giây.`);
  }
  //*: nếu không bị giới hạn
  else {
    let promises = [];
    const { email, password, doNotLogout } = req.body;
    //! nếu ko có email hoặc pass dc gửi lên
    if (!(email && password)) {
      return res.status(400).send('All inputs are required');
    }
    const user = await User.findOne({ email });

    try {
      //! nếu sai tên user thì chỉ giới hạn IP
      if (user === null) {
        await limiterSlowBruteByIP.consume(ipAddr);
        return res.status(401).send('wrong credentials');
      }

      //! nếu sai mật khẩu thì giới hạn cả IP và Ip+email

      if (!(await user.correctPassword(password, user.password))) {
        promises.push([limiterSlowBruteByIP.consume(ipAddr)]);
        promises.push(limiterConsecutiveFailsByEmailAndIP.consume(emailIPkey));

        const result = await Promise.all(promises);

        //! phân biệt 1 và 0 để cải thiện UX hơn
        if (result[1].remainingPoints >= 1) {
          return res
            .status(401)
            .send(
              `Sai mật khẩu, Bạn còn ${result[1].remainingPoints} lần đăng nhập `
            );
        }

        return res.status(401).send(`Bạn đã hết số lần đăng nhập`);
      }
    } catch (rlRejected) {
      if (rlRejected instanceof Error) {
        throw rlRejected;
      } else {
        const timeOut = String(Math.round(rlRejected.msBeforeNext / 1000)) || 1;
        res.set('Retry-After', timeOut);
        return res
          .status(429)
          .send(`Sai quá nhiều lần, vui lòng thử lại sau ${timeOut} giây`);
      }
    }
    //! THÀNH CÔNG nếu xuống dc tới đây ---> xóa key trên redis
    if (resEmailAndIP !== null && resEmailAndIP.consumedPoints > 0) {
      //todo: Reset limiter dựa vào IP + email on successful authorisation
      await limiterConsecutiveFailsByEmailAndIP.delete(emailIPkey);
    }
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
    // return res.status(401).send('wrong credentials');
  }
};
