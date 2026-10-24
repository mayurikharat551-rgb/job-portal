const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'An account with this email already exists' });

    // Only student/employer can self-register. Admins are created via seed script.
    const safeRole = role === 'employer' ? 'employer' : 'student';

    const user = await User.create({
      name,
      email,
      passwordHash: await User.hashPassword(password),
      role: safeRole,
      companyName: safeRole === 'employer' ? companyName || '' : '',
    });

    res.status(201).json({ token: signToken(user._id), user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ token: signToken(user._id), user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};
