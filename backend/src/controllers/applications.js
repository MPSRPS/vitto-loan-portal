'use strict';

const db = require('../db');

/**
 * POST /api/applications
 * Create a new loan application.
 */
async function createApplication(req, res, next) {
  const { name, mobile, amount, purpose, language } = req.body;

  const result = await db.query(
    `INSERT INTO applications (name, mobile, amount, purpose, language)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, mobile, amount, purpose, language, status, created_at`,
    [name, mobile, amount, purpose, language]
  );

  return res.status(201).json({ success: true, data: result.rows[0] });
}

/**
 * GET /api/applications
 * Return all applications with optional ?status= and ?search= filters.
 */
async function getApplications(req, res, next) {
  const { status, search } = req.query;
  const values = [];
  const conditions = [];

  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (search && search.trim().length > 0) {
    const term = `%${search.trim().toLowerCase()}%`;
    values.push(term);
    conditions.push(
      `(LOWER(name) LIKE $${values.length} OR mobile LIKE $${values.length})`
    );
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await db.query(
    `SELECT id, name, mobile, amount, purpose, language, status, created_at
     FROM applications
     ${whereClause}
     ORDER BY created_at DESC`,
    values
  );

  return res.json({ success: true, data: result.rows });
}

/**
 * PATCH /api/applications/:id/status
 * Update a single application's status.
 */
async function updateStatus(req, res, next) {
  const { id }     = req.params;
  const { status } = req.body;

  const result = await db.query(
    `UPDATE applications
     SET status = $1
     WHERE id = $2
     RETURNING id, name, mobile, amount, purpose, language, status, created_at`,
    [status, id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({
      success: false,
      error: `Application with id ${id} not found.`,
    });
  }

  return res.json({ success: true, data: result.rows[0] });
}

/**
 * GET /api/summary
 * Aggregate stats for the dashboard stats bar.
 */
async function getSummary(req, res, next) {
  const result = await db.query(
    `SELECT
       COUNT(*)                                              AS total_applications,
       COALESCE(SUM(amount), 0)                             AS total_amount_requested,
       COUNT(*) FILTER (WHERE status = 'pending')           AS count_pending,
       COUNT(*) FILTER (WHERE status = 'approved')          AS count_approved,
       COUNT(*) FILTER (WHERE status = 'rejected')          AS count_rejected
     FROM applications`
  );

  const row = result.rows[0];

  return res.json({
    success: true,
    data: {
      total_applications:    parseInt(row.total_applications, 10),
      total_amount_requested: parseFloat(row.total_amount_requested),
      count_pending:          parseInt(row.count_pending, 10),
      count_approved:         parseInt(row.count_approved, 10),
      count_rejected:         parseInt(row.count_rejected, 10),
    },
  });
}

module.exports = { createApplication, getApplications, updateStatus, getSummary };
