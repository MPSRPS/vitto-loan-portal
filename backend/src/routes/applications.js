'use strict';

const { Router } = require('express');
const {
  createApplication,
  getApplications,
  updateStatus,
} = require('../controllers/applications');
const { validateApplication, validateStatusUpdate } = require('../middleware/validate');

// Wrap async handlers — Express 4 does not catch async errors automatically
const w = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

router.post('/',            validateApplication,  w(createApplication));
router.get('/',                                   w(getApplications));
router.patch('/:id/status', validateStatusUpdate, w(updateStatus));

module.exports = router;
