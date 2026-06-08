'use strict';

const VALID_LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'];
const VALID_STATUSES  = ['pending', 'approved', 'rejected'];

/**
 * Validate POST /api/applications body.
 * Attaches sanitised values to req.body on success.
 */
function validateApplication(req, res, next) {
  const { name, mobile, amount, purpose, language } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string.');
  }

  if (!mobile || !/^\d{10}$/.test(String(mobile).trim())) {
    errors.push('mobile must be a 10-digit Indian mobile number.');
  }

  const parsedAmount = parseFloat(amount);
  if (amount === undefined || amount === null || isNaN(parsedAmount) || parsedAmount <= 0) {
    errors.push('amount must be a positive number (in ₹).');
  }

  if (!purpose || typeof purpose !== 'string' || purpose.trim().length === 0) {
    errors.push('purpose is required and must be a non-empty string.');
  }

  if (!language || !VALID_LANGUAGES.includes(language)) {
    errors.push(`language must be one of: ${VALID_LANGUAGES.join(', ')}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors.join(' ') });
  }

  // Sanitise
  req.body.name     = name.trim();
  req.body.mobile   = String(mobile).trim();
  req.body.amount   = parsedAmount;
  req.body.purpose  = purpose.trim();
  req.body.language = language;

  return next();
}

/**
 * Validate PATCH /api/applications/:id/status body.
 */
function validateStatusUpdate(req, res, next) {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `status must be one of: ${VALID_STATUSES.join(', ')}.`,
    });
  }

  return next();
}

module.exports = { validateApplication, validateStatusUpdate };
