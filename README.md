# Vitto Loan Application Portal

A full-stack loan application portal built for Vitto — an inclusive FinTech company.
Field agents and borrowers submit loan applications; an operations team reviews and
updates statuses via a real-time dashboard.

**Live URL:** `https://vitto-loan-portal-lemon.vercel.app/dashboard`  
**API Base:** `https://vitto-loan-portal-api.onrender.com/`

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Node.js 18 + Express.js             |
| Frontend  | React 18 + Vite 5                   |
| Database  | PostgreSQL (Neon)                   |
| Backend host | Render (free tier)               |
| Frontend host | Vercel (free tier)              |

---

## Local Setup (5 minutes)

### Prerequisites
- Node.js ≥ 18
- A Neon PostgreSQL database (or any PostgreSQL instance)

### 1 — Clone the repo

```bash
git clone https://github.com/<your-username>/vitto-loan-application-portal.git
cd vitto-loan-application-portal
```

### 2 — Run the database migration

Connect to your Neon database and run:

```sql
-- in the Neon SQL editor or psql
\i backend/migrations/001_init.sql
```

### 3 — Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL=postgresql://neondb_owner:<password>@<host>/neondb?sslmode=require
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Install and start:

```bash
npm install
npm run dev
```

API is available at `http://localhost:5000`.

### 4 — Configure the frontend

```bash
cd ../frontend
cp .env.example .env
```

Edit `.env`:

```
VITE_API_BASE_URL=http://localhost:5000
```

Install and start:

```bash
npm install
npm run dev
```

App is available at `http://localhost:5173`.

---

## API Documentation

### `GET /health`

Health check.

**Response 200:**
```json
{ "status": "ok" }
```

---

### `POST /api/applications`

Submit a new loan application.

**Request body:**
```json
{
  "name":     "Priya Sharma",
  "mobile":   "9876543210",
  "amount":   50000,
  "purpose":  "Medical emergency",
  "language": "Hindi"
}
```

Valid `language` values: `Hindi`, `Tamil`, `Telugu`, `Marathi`, `English`

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id":         "a3b4c5d6-...",
    "name":       "Priya Sharma",
    "mobile":     "9876543210",
    "amount":     "50000.00",
    "purpose":    "Medical emergency",
    "language":   "Hindi",
    "status":     "pending",
    "created_at": "2025-06-08T12:00:00.000Z"
  }
}
```

**Response 400** (validation failure):
```json
{ "success": false, "error": "mobile must be a 10-digit Indian mobile number." }
```

---

### `GET /api/applications`

Return all applications, latest first.

**Query params (all optional):**

| Param    | Description                                      |
|----------|--------------------------------------------------|
| `status` | Filter by `pending`, `approved`, or `rejected`   |
| `search` | Filter by applicant name or mobile (partial match)|

**Example:** `GET /api/applications?status=pending&search=priya`

**Response 200:**
```json
{
  "success": true,
  "data": [ { ...application }, ... ]
}
```

---

### `PATCH /api/applications/:id/status`

Update the status of an application.

**Request body:**
```json
{ "status": "approved" }
```

Valid values: `pending`, `approved`, `rejected`

**Response 200:**
```json
{ "success": true, "data": { ...updatedApplication } }
```

**Response 404:**
```json
{ "success": false, "error": "Application with id <id> not found." }
```

**Response 400:**
```json
{ "success": false, "error": "status must be one of: pending, approved, rejected." }
```

---

### `GET /api/summary`

Dashboard aggregate statistics.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_applications":    42,
    "total_amount_requested": 2100000,
    "count_pending":          18,
    "count_approved":         20,
    "count_rejected":          4
  }
}
```

---

## Deployment

### Step 1 — Run the migration on Neon

1. Open your Neon project → **SQL Editor**
2. Paste the contents of `backend/migrations/001_init.sql`
3. Click **Run**

---

### Step 2 — Deploy the backend to Render

1. Push this repo to a **public** GitHub repository
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo, select the **`backend/`** folder as the root directory (or use the `render.yaml` at the root of the `backend/` folder)
4. Set **Build Command:** `npm install`
5. Set **Start Command:** `npm start`
6. Add **Environment Variables:**

| Key            | Value                                           |
|----------------|-------------------------------------------------|
| `DATABASE_URL` | Your Neon connection string                      |
| `PORT`         | `5000`                                          |
| `NODE_ENV`     | `production`                                    |
| `CORS_ORIGIN`  | Your Vercel frontend URL (set after Step 3)     |

7. Click **Deploy**. Copy the Render service URL (e.g. `https://vitto-api.onrender.com`).

---

### Step 3 — Deploy the frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo, set **Root Directory** to `frontend/`
3. Add **Environment Variable:**

| Key                 | Value                                      |
|---------------------|--------------------------------------------|
| `VITE_API_BASE_URL` | Your Render backend URL from Step 2        |

4. Click **Deploy**. Copy the Vercel URL (e.g. `https://vitto-portal.vercel.app`).

---

### Step 4 — Update CORS on Render

Go back to Render → your service → **Environment** and update:

| Key           | Value                           |
|---------------|---------------------------------|
| `CORS_ORIGIN` | `https://vitto-portal.vercel.app` |

Render will auto-redeploy.

---

## Known Issues

- **Search is server-side:** Search is performed via a `LIKE` query. For very large datasets, full-text search (pg_tsvector) would be more performant. The index on the `name` column mitigates this at current scale.
- There is absolutely no authentication or authorization. Anyone who finds the API URL can query GET /api/applications and instantly download the Personally Identifiable Information names and mobile numbers of every single applicant.
- The applications endpoint currently returns all records without pagination, which may impact performance as the dataset grows.
- The backend does not check if an active application already exists for a mobile number (Duplicate Loans).
- Application status changes currently overwrite the existing status value. As a result, there is no historical record of who changed a status or when the change occurred.

---

## What I'd Improve (given more time)

- Add pagination to the applications table for scale
- Implement email/SMS notifications on status change using Resend or Twilio
- Prevent duplicate pending applications for the same mobile number.
- Introduce stricter status transition rules and confirmation workflows.
- Add application detail pages.
- Implement authentication and role-based access control.
- Set up a CI/CD pipeline (GitHub Actions → Render + Vercel)
