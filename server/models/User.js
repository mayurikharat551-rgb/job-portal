const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['student', 'employer', 'admin'],
      default: 'student',
    },
    phone: { type: String, trim: true, default: '' },
    education: { type: String, trim: true, default: '' },
    skills: { type: [String], default: [] },
    summary: { type: String, trim: true, maxlength: 1000, default: '' },
    resumeUrl: { type: String, trim: true, default: '' },
    companyName: { type: String, trim: true, default: '' },
    companyWebsite: { type: String, trim: true, default: '' },
    companyLocation: { type: String, trim: true, default: '' },
    experienceYears: { type: String, trim: true, default: 'Fresher' },
    headline: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = function (plain) {
  return bcrypt.hash(plain, 12);
};

userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
