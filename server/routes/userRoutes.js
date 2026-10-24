const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const users = require('../controllers/userController');

router.use(protect);

router.get('/me', users.getMe);
router.put(
  '/me',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional({ values: 'falsy' }).matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Enter a valid phone number'),
    body('resumeUrl').optional({ values: 'falsy' }).isURL().withMessage('Resume must be a valid URL'),
    body('summary').optional().isLength({ max: 1000 }).withMessage('Summary must be under 1000 characters'),
  ],
  validate,
  users.updateMe
);

router.get('/', authorize('admin'), users.listUsers);
router.delete('/:id', authorize('admin'), users.deleteUser);

module.exports = router;
