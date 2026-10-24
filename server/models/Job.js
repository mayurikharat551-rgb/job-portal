const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true },
    responsibilities: { type: [String], default: [] },
    type: { type: String, enum: ['job', 'internship'], required: true },
    location: { type: String, required: true, trim: true },
    skills: { type: [String], default: [] },
    eligibility: { type: String, trim: true, default: '' },
    stipendOrSalary: { type: String, trim: true, default: '' },
    experience: { type: String, trim: true, default: '0-2 Yrs' },
    workMode: { type: String, enum: ['Remote', 'Hybrid', 'On-site', 'Any'], default: 'On-site' },
    department: { type: String, trim: true, default: 'Engineering' },
    companyLogo: { type: String, trim: true, default: '' },
    openingsCount: { type: Number, default: 1 },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ status: 1, type: 1, location: 1 });

module.exports = mongoose.model('Job', jobSchema);
