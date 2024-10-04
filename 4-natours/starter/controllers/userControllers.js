const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

/* eslint-disable arrow-body-style */
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //send the response.
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.getUserById = (req, res) => {
  return res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};

exports.createUser = (req, res) => {
  return res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};

exports.updateUser = (req, res) => {
  return res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};

exports.deleteUser = (req, res) => {
  return res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};
