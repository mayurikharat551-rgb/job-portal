const Job = require('../models/Job');
const Application = require('../models/Application');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toArray = (v) =>
  Array.isArray(v)
    ? v.map((s) => String(s).trim()).filter(Boolean)
    : String(v || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

// GET /api/jobs  — public, active listings with search + filters
exports.getJobs = async (req, res, next) => {
  try {
    const { q, type, location, skills, experience, workMode, page = 1, limit = 12 } = req.query;
    const filter = { status: 'active', deadline: { $gte: new Date() } };

    if (type && ['job', 'internship'].includes(type)) filter.type = type;
    if (location) filter.location = new RegExp(escapeRegex(location), 'i');
    if (experience) filter.experience = new RegExp(escapeRegex(experience), 'i');
    if (workMode && ['Remote', 'Hybrid', 'On-site'].includes(workMode)) filter.workMode = workMode;
    if (skills) {
      filter.skills = {
        $in: toArray(skills).map((s) => new RegExp(`^${escapeRegex(s)}$`, 'i')),
      };
    }
    if (q) {
      const rx = new RegExp(escapeRegex(q), 'i');
      filter.$or = [{ title: rx }, { company: rx }, { description: rx }, { skills: rx }, { department: rx }];
    }

    const p = Math.max(parseInt(page, 10) || 1, 1);
    const l = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
      Job.countDocuments(filter),
    ]);

    res.json({ jobs, total, page: p, pages: Math.ceil(total / l) });
  } catch (err) {
    next(err);
  }
};

// GET /api/jobs/:id
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Listing not found' });
    res.json(job);
  } catch (err) {
    next(err);
  }
};

// GET /api/jobs/mine/list  — employer sees own, admin sees all
exports.getManagedJobs = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    const counts = await Application.aggregate([
      { $match: { jobId: { $in: jobs.map((j) => j._id) } } },
      {
        $group: {
          _id: '$jobId',
          total: { $sum: 1 },
          shortlisted: {
            $sum: { $cond: [{ $in: ['$status', ['Shortlisted', 'Interview Scheduled', 'Selected']] }, 1, 0] },
          },
        },
      },
    ]);
    const map = Object.fromEntries(counts.map((c) => [String(c._id), c]));
    res.json(
      jobs.map((j) => {
        const stats = map[String(j._id)] || { total: 0, shortlisted: 0 };
        return {
          ...j.toObject(),
          applicantCount: stats.total,
          shortlistedCount: stats.shortlisted,
        };
      })
    );
  } catch (err) {
    next(err);
  }
};

const pickJobFields = (body) => ({
  title: body.title,
  company: body.company,
  description: body.description,
  responsibilities: toArray(body.responsibilities),
  type: body.type,
  location: body.location,
  skills: toArray(body.skills),
  eligibility: body.eligibility,
  stipendOrSalary: body.stipendOrSalary,
  experience: body.experience || '0-2 Yrs',
  workMode: body.workMode || 'On-site',
  department: body.department || 'Engineering',
  companyLogo: body.companyLogo || '',
  openingsCount: body.openingsCount ? Number(body.openingsCount) : 1,
  deadline: body.deadline,
  ...(body.status ? { status: body.status } : {}),
});

// POST /api/jobs
exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...pickJobFields(req.body), createdBy: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

const loadOwned = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404).json({ message: 'Listing not found' });
    return null;
  }
  if (req.user.role !== 'admin' && String(job.createdBy) !== String(req.user._id)) {
    res.status(403).json({ message: 'You can only manage your own listings' });
    return null;
  }
  return job;
};

// PUT /api/jobs/:id
exports.updateJob = async (req, res, next) => {
  try {
    const job = await loadOwned(req, res);
    if (!job) return;
    Object.assign(job, pickJobFields({ ...job.toObject(), ...req.body }));
    await job.save();
    res.json(job);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/jobs/:id/close
exports.closeJob = async (req, res, next) => {
  try {
    const job = await loadOwned(req, res);
    if (!job) return;
    job.status = req.body.status === 'active' ? 'active' : 'closed';
    await job.save();
    res.json(job);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/jobs/:id
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await loadOwned(req, res);
    if (!job) return;
    await Application.deleteMany({ jobId: job._id });
    await job.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    next(err);
  }
};
