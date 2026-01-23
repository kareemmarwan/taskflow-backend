const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token
  if (!req.headers.authorization?.startsWith('Bearer')) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    token = req.headers.authorization.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    console.error(error); // استخدم logger في الإنتاج
    res.status(401);
    throw new Error('Not authorized');
  }
});

module.exports = { protect };
