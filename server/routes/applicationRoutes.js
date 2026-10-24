const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { STATUSES } = require('../models/Application');
const apps = require('../controllers/applicationController');

router.use(protect);

router.get('/me', apps.myApplications);
router.get('/', authorize('admin'), apps.allApplications);
router.get('/job/:jobId', authorize('employer', 'admin'), apps.jobApplicants);
router.patch(
  '/:id/status',
  authorize('employer', 'admin'),
  [
    body('status').isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
    body('recruiterFeedback').optional().isString().trim(),
    body('interviewDate').optional({ values: 'falsy' }),
  ],
  validate,
  apps.updateStatus
);

module.exports = router;
