const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/AppError");
const httpStatus = require("../utils/httpStatusText");
const User = require("../models/user.model");
const generateJWT = require("../utils/generateJWT");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const forgotPassword = (req, res) => {
  res.render("forgot-password");
};

const sendForgotPasswordLink = asyncWrapper(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    const error = appError.create("User not found", 404, httpStatus.FAIL);
    return next(error);
  }
  const srcretKey = process.env.JWT_SECRET_KEY + user.password;

  const token = await generateJWT(
    { email: user.email, id: user._id, role: user.role },
    srcretKey
  );
  

  // send link to the user
  const link = `http://localhost:3030/password/reset-password/${user._id}/${token}`;

  const transPorter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "Reset Password",
    html: `<div>
            <h4>Click on the link below to rest your password</h4>
            <p>${link}</p>    
          </div>`,
  };

  transPorter.sendMail(mailOptions, (err, success)=>{
    if (err) {
      const error = appError.create(err, 404, httpStatus.FAIL);
      return next(error);
    }
    res.render('link-success');  
    res.status(200).json({ status: httpStatus.SUCCESS, message: success.response })
  })

});






const getResetPasswordView = asyncWrapper(async (req, res, next) => {
  const { userId, token } = req.params;
  const user = await User.findById({ _id: userId });

  if (!user) {
    const error = appError.create("User not found", 404, httpStatus.FAIL);
    return next(error);
  }
  const srcretKey = process.env.JWT_SECRET_KEY + user.password;

  jwt.verify(token, srcretKey, (err, data) => {
    if (err) {
      const error = appError.create(err, 401, httpStatus.FAIL);
      return next(error);
    }
    res.render("reset-password", { email: user.email });
  });
});





const resetPassword = asyncWrapper(async (req, res, next) => {
  const { userId, token } = req.params;
  const { password } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    const error = appError.create("User not found", 404, httpStatus.FAIL);
    return next(error);
  }

  const srcretKey = process.env.JWT_SECRET_KEY + user.password;

  jwt.verify(token, srcretKey, async (err, data) => {
    if (err) {
      const error = appError.create(err, 401, httpStatus.FAIL);
      return next(error);
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.render("success-reset");
  });
});


module.exports = {
  forgotPassword,
  sendForgotPasswordLink,
  getResetPasswordView,
  resetPassword,
};
