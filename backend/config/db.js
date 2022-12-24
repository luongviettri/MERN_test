require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      '-----------------------------SUCCESS Ket noi voi mongoDB-----------------------------'
    );
  } catch (error) {
    console.log('FAIL Ket noi voi mongoDB');
    process.exit(1);
  }
};
module.exports = connectDB;
