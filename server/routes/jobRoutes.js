const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const jobs = require('../controllers/jobController');
const { apply } = require('../controllers/applicationController');

const jobRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').isIn(['job', 'internship']).withMessage('Type must be job or internship'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('deadline').isISO8601().withMessage('A valid deadline date is required'),
];

router.get('/', jobs.getJobs);
router.get('/mine/list', protect, authorize('employer', 'admin'), jobs.getManagedJobs);
router.get('/:id', jobs.getJob);

router.post('/', protect, authorize('employer', 'admin'), jobRules, validate, jobs.createJob);
router.put('/:id', protect, authorize('employer', 'admin'), jobRules, validate, jobs.updateJob);
router.patch('/:id/close', protect, authorize('employer', 'admin'), jobs.closeJob);
router.delete('/:id', protect, authorize('employer', 'admin'), jobs.deleteJob);

router.post(
  '/:id/apply',
  protect,
  [
    body('resumeUrl').optional({ values: 'falsy' }).isURL().withMessage('Resume must be a valid URL'),
    body('coverLetter').optional().isLength({ max: 3000 }).withMessage('Cover letter is too long'),
  ],
  validate,
  apply
);

module.exports = router;
