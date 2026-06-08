'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased for Neon DB cold starts
});

pool.on('error', (err) => {
  process.stderr.write(`Unexpected DB pool error: ${err.message}\n`);
  // Do not process.exit(1) here, let pg attempt to reconnect.
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
