const mongoose = require('mongoose');

const STATUSES = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    resumeUrl: { type: String, trim: true, default: '' },
    coverLetter: { type: String, trim: true, maxlength: 3000, default: '' },
    status: { type: String, enum: STATUSES, default: 'Submitted' },
    recruiterFeedback: { type: String, trim: true, default: '' },
    interviewDate: { type: Date },
    shortlistedAt: { type: Date },
  },
  { timestamps: { createdAt: 'appliedAt', updatedAt: 'updatedAt' } }
);

// Prevent duplicate applications to the same listing (FR-07)
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
module.exports.STATUSES = STATUSES;
