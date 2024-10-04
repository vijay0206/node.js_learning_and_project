/* eslint-disable arrow-body-style */
const crypto = require('crypto');
const { promisify } = require('util');

const jwt = require('jsonwebtoken');

const AppError = require('../utils/AppError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    message: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email and password exits in request.
  if (!email || !password) {
    return next(new AppError('Please provide and password', 400));
  }

  //check if user exists and password is correct.
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  //if everything is okay, send token to client.
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1. get the token from the request and check if it exists.

  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in, please login to access this resource',
        401,
      ),
    );
  }
  //2. validate the token. (verification)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3. Check if user still exists.
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('User belonging to token no longer exists', 401));
  }

  //. If user changed password after token jwt was issued.
  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new AppError(
        'User recently changed the password, please login again',
        401,
      ),
    );

  // grant access to the protected route.
  req.user = user;
  next();
});

exports.restrict = (...roles) => {
  return (req, res, next) => {
    //roles ['admin', 'lead-guide']

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403),
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on posted email.
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    next(new AppError('There is no user with the email address', 404));
  }
  //generate a random reset token.
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  //send it to user's email.
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forget your password ? submit a PATCH request with your new password 
  and passwordConfirm to ${resetURL}.\nIgnore if it was not you.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password Reset Token (valid for 10 mins)',
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error in sending email try again later', 500),
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get user based on the token.
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //Set new password if token is not expired and there is a user.
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //update the passwordChangedAt property for the user. we are doing it in the model.

  //log the user in.
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {});
