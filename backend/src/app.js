'use strict';

require('dotenv').config();

const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');

const applicationRoutes = require('./routes/applications');
const { getSummary }     = require('./controllers/applications');

// Wrap async route handlers so unhandled rejections reach the error middleware
const asyncWrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);


const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — restricted to the configured frontend origin ─────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// ── Body parser ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ── Global rate limiter ─────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests — please try again later.' },
});
app.use(limiter);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── API routes ───────────────────────────────────────────────────────────────
app.use('/api/applications', applicationRoutes);
app.get('/api/summary',      asyncWrap(getSummary));

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

// ── Centralised error handler ─────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error.'
      : err.message;
  res.status(status).json({ success: false, error: message });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  process.stdout.write(`Vitto API listening on port ${PORT}\n`);
});

module.exports = app;
