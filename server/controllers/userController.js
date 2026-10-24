const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const toArray = (v) =>
  Array.isArray(v)
    ? v.map((s) => String(s).trim()).filter(Boolean)
    : String(v || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

// GET /api/users/me
exports.getMe = async (req, res) => {
  res.json(req.user.toSafeJSON());
};

// PUT /api/users/me
exports.updateMe = async (req, res, next) => {
  try {
    const { name, phone, education, skills, summary, resumeUrl, companyName } = req.body;
    const u = req.user;
    if (name !== undefined) u.name = name;
    if (phone !== undefined) u.phone = phone;
    if (education !== undefined) u.education = education;
    if (skills !== undefined) u.skills = toArray(skills);
    if (summary !== undefined) u.summary = summary;
    if (resumeUrl !== undefined) u.resumeUrl = resumeUrl;
    if (companyName !== undefined && u.role === 'employer') u.companyName = companyName;
    await u.save();
    res.json(u.toSafeJSON());
  } catch (err) {
    next(err);
  }
};

// GET /api/users  — admin
exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(200);
    res.json(users.map((u) => u.toSafeJSON()));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id  — admin
exports.deleteUser = async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await Application.deleteMany({ userId: user._id });
    const jobs = await Job.find({ createdBy: user._id }, '_id');
    await Application.deleteMany({ jobId: { $in: jobs.map((j) => j._id) } });
    await Job.deleteMany({ createdBy: user._id });
    await user.deleteOne();
    res.json({ message: 'User and related records deleted' });
  } catch (err) {
    next(err);
  }
};
