const Job = require('../models/Job');
const Application = require('../models/Application');

// POST /api/jobs/:id/apply
exports.apply = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students / job seekers can apply' });
    }
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Listing not found' });
    if (job.status !== 'active' || job.deadline < new Date()) {
      return res.status(400).json({ message: 'This listing is closed for applications' });
    }

    const existing = await Application.findOne({ userId: req.user._id, jobId: job._id });
    if (existing) return res.status(409).json({ message: 'You have already applied to this listing' });

    const application = await Application.create({
      userId: req.user._id,
      jobId: job._id,
      resumeUrl: req.body.resumeUrl || req.user.resumeUrl || '',
      coverLetter: req.body.coverLetter || '',
    });
    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/me
exports.myApplications = async (req, res, next) => {
  try {
    const apps = await Application.find({ userId: req.user._id })
      .sort({ appliedAt: -1 })
      .populate('jobId', 'title company type location status deadline stipendOrSalary experience workMode department companyLogo');
    res.json(apps);
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/job/:jobId  — employer (own job) / admin
exports.jobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Listing not found' });
    if (req.user.role !== 'admin' && String(job.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only view applicants of your own listings' });
    }
    const apps = await Application.find({ jobId: job._id })
      .sort({ appliedAt: -1 })
      .populate('userId', 'name email phone education skills summary resumeUrl experienceYears headline');
    res.json({ job, applications: apps });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/applications/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id).populate('jobId', 'createdBy title company');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (
      req.user.role !== 'admin' &&
      String(app.jobId.createdBy) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: 'You can only update applications for your own listings' });
    }

    app.status = req.body.status;
    if (req.body.status === 'Shortlisted' && !app.shortlistedAt) {
      app.shortlistedAt = new Date();
    }
    if (req.body.recruiterFeedback !== undefined) {
      app.recruiterFeedback = req.body.recruiterFeedback;
    }
    if (req.body.interviewDate !== undefined) {
      app.interviewDate = req.body.interviewDate ? new Date(req.body.interviewDate) : null;
    }

    await app.save();
    res.json({
      _id: app._id,
      status: app.status,
      recruiterFeedback: app.recruiterFeedback,
      interviewDate: app.interviewDate,
      shortlistedAt: app.shortlistedAt,
      updatedAt: app.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/applications  — admin: all application records
exports.allApplications = async (req, res, next) => {
  try {
    const apps = await Application.find()
      .sort({ appliedAt: -1 })
      .limit(200)
      .populate('userId', 'name email')
      .populate('jobId', 'title company');
    res.json(apps);
  } catch (err) {
    next(err);
  }
};
