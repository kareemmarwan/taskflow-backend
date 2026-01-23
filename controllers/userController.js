const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../Utils/sendMailer");
const {
  generateToken,
  generateRefreshToken,
} = require("../Utils/generateToken");

/* =========================
   Helpers
========================= */
const validateEmail = (email) => {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const validatePassword = (password) =>
  password && password.length >= 7;

const isValidGender = (gender) =>
  ["male", "female", "other"].includes(gender?.toLowerCase());

/* =========================
   Users
========================= */

// @desc Get all users
// @route GET /api/users
// @access Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// @desc Register user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, gender } = req.body;

  if (!name || !email || !password || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!validatePassword(password)) {
    return res
      .status(400)
      .json({ message: "Password must be at least 7 characters" });
  }

  if (!isValidGender(gender)) {
    return res.status(400).json({ message: "Invalid gender" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    gender,
    image: req.file
      ? `${req.protocol}://${req.get("host")}/public/uploads/${req.file.filename}`
      : "",
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  });
});

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password} = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password required" });
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  });
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ message: "User not found" });

  if (user._id.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { name, email, password, gender } = req.body;

  if (email && !validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password && !validatePassword(password)) {
    return res
      .status(400)
      .json({ message: "Password must be at least 7 characters" });
  }

  if (gender && !isValidGender(gender)) {
    return res.status(400).json({ message: "Invalid gender" });
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.gender = gender || user.gender;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  if (req.file) {
    user.image = `${req.protocol}://${req.get(
      "host"
    )}/public/uploads/${req.file.filename}`;
  }

  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ message: "User not found" });

  if (user._id.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await user.deleteOne();
  res.status(200).json({ message: "User deleted successfully" });
});

// @desc Get current user
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

/* =========================
   Password & Email
========================= */

// @desc Send reset code
// @route POST /api/users/sendcode
// @access Public
const sendCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "Email not found" });

  await sendEmail(email);
  res.status(200).json({ message: "Code sent to email" });
});

// @desc Confirm code
// @route POST /api/users/confirmcode
// @access Public
const confirmCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "User not found" });

  if (user.code !== code) {
    return res.status(400).json({ message: "Invalid code" });
  }

  res.status(200).json({ message: "Code verified" });
});

// @desc Reset password
// @route POST /api/users/newpassword
// @access Public
const newPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!validatePassword(password)) {
    return res
      .status(400)
      .json({ message: "Password must be at least 7 characters" });
  }

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "User not found" });

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

/* =========================
   Tokens
========================= */

// @desc Refresh access token
// @route POST /api/users/refresh
// @access Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    res.status(200).json({
      token: generateToken(decoded.id),
    });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

/* =========================
   Export
========================= */
module.exports = {
  getUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getMe,
  sendCode,
  confirmCode,
  newPassword,
  refreshToken,
};
