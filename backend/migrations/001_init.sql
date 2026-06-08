-- migrations/001_init.sql
-- Vitto Loan Application Portal — initial schema


BEGIN;

CREATE TABLE IF NOT EXISTS applications (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255)  NOT NULL,
  mobile      VARCHAR(10)   NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,
  purpose     TEXT          NOT NULL,
  language    VARCHAR(20)   NOT NULL
                CHECK (language IN ('Hindi','Tamil','Telugu','Marathi','English')),
  status      VARCHAR(20)   NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','approved','rejected')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_applications_status     ON applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_name       ON applications USING gin (to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_applications_mobile     ON applications (mobile);

COMMIT;
