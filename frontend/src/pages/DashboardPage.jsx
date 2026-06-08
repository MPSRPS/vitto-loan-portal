import { useState, useEffect, useCallback } from 'react';
import { fetchApplications, fetchSummary, updateApplicationStatus } from '../api/applications';
import StatusBadge from '../components/StatusBadge';
import LanguageBadge from '../components/LanguageBadge';

const DEBOUNCE_MS = 400;

function fmt(n) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function useDebounce(value, delay) {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
}

const STAT_ICONS = {
  total: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  amount: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="22" x2="21" y2="22"></line>
      <line x1="6" y1="18" x2="6" y2="11"></line>
      <line x1="10" y1="18" x2="10" y2="11"></line>
      <line x1="14" y1="18" x2="14" y2="11"></line>
      <line x1="18" y1="18" x2="18" y2="11"></line>
      <polygon points="12 2 20 7 4 7"></polygon>
    </svg>
  ),
  pending: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 22h14"></path>
      <path d="M5 2h14"></path>
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
    </svg>
  ),
  approved: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  rejected: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  ),
};

function StatsBar({ summary, loading }) {
  const stats = [
    { key: 'total',    label: 'Total Applications', value: summary?.total_applications,                          cls: 'total'    },
    { key: 'amount',   label: 'Total Requested',    value: summary ? fmt(summary.total_amount_requested) : null, cls: 'amount'   },
    { key: 'pending',  label: 'Pending Review',     value: summary?.count_pending,                               cls: 'pending'  },
    { key: 'approved', label: 'Approved',           value: summary?.count_approved,                              cls: 'approved' },
    { key: 'rejected', label: 'Rejected',           value: summary?.count_rejected,                              cls: 'rejected' },
  ];

  return (
    <div className="stats-bar" role="region" aria-label="Summary statistics">
      {stats.map(({ key, label, value, cls }) => (
        <div key={key} className={`stat-card stat-card--${cls}`}>
          <div className="stat-card__header">
            <div className="stat-card__icon" aria-hidden="true">
              {STAT_ICONS[key]}
            </div>
            <div className="stat-card__label">{label}</div>
          </div>
          <div className="stat-card__value" id={`stat-${key}`} aria-busy={loading}>
            {loading ? '—' : (value ?? '—')}
          </div>
        </div>
      ))}
    </div>
  );
}

function ApplicationRow({ app, onStatusChange, updatingId }) {
  const busy = updatingId === app.id;
  return (
    <tr>
      <td>
        <div className="td-name">{app.name}</div>
        <div className="td-mobile">{app.mobile}</div>
      </td>
      <td className="td-amount">{fmt(app.amount)}</td>
      <td><div className="td-purpose" title={app.purpose}>{app.purpose}</div></td>
      <td><LanguageBadge language={app.language} /></td>
      <td><StatusBadge status={app.status} /></td>
      <td className="td-date">{fmtDate(app.created_at)}</td>
      <td>
        <div className="td-actions">
          {app.status !== 'approved' && (
            <button
              className="btn btn--sm btn--approve"
              id={`approve-${app.id}`}
              disabled={busy}
              aria-label={`Approve application for ${app.name}`}
              onClick={() => onStatusChange(app.id, 'approved')}
            >
              {busy ? '…' : 'Approve'}
            </button>
          )}
          {app.status !== 'rejected' && (
            <button
              className="btn btn--sm btn--reject"
              id={`reject-${app.id}`}
              disabled={busy}
              aria-label={`Reject application for ${app.name}`}
              onClick={() => onStatusChange(app.id, 'rejected')}
            >
              {busy ? '…' : 'Reject'}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [summary,      setSummary]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [summaryLoad,  setSummaryLoad]  = useState(true);
  const [error,        setError]        = useState('');
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId,   setUpdatingId]   = useState(null);

  const debouncedSearch = useDebounce(search, DEBOUNCE_MS);

  const loadSummary = useCallback(async () => {
    try { const res = await fetchSummary(); setSummary(res.data); }
    catch { /* non-critical */ }
    finally { setSummaryLoad(false); }
  }, []);

  const loadApplications = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetchApplications({
        status: statusFilter || undefined,
        search: debouncedSearch || undefined,
      });
      setApplications(res.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [statusFilter, debouncedSearch]);

  useEffect(() => { loadSummary(); },      [loadSummary]);
  useEffect(() => { loadApplications(); }, [loadApplications]);

  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id);
    try {
      const res = await updateApplicationStatus(id, newStatus);
      setApplications((prev) => prev.map((a) => (a.id === id ? res.data : a)));
      loadSummary();
    } catch (err) { setError(err.message); }
    finally { setUpdatingId(null); }
  }

  return (
    <>
      <div className="page-header">
        <h1>Loan <span className="gradient-text">Applications</span></h1>
        <p>Review and manage all field-submitted loan applications in real time.</p>
      </div>

      <StatsBar summary={summary} loading={summaryLoad} />

      {error && (
        <div className="alert alert--error" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </div>
      )}

      <div className="table-section">
        <div className="table-section__header">
          <div className="table-section__title">
            All Applications
            {!loading && (
              <span className="count-badge" style={{ marginLeft: '0.75rem' }}>
                {applications.length}
              </span>
            )}
          </div>

          <div className="table-section__controls">
            <div className="search-wrap">
              <svg className="search-wrap__icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                id="search-input"
                className="search-input"
                type="search"
                placeholder="Search name or mobile…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search applications"
              />
            </div>

            <select
              id="status-filter"
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div role="region" aria-label="Applications table" aria-live="polite">
          {loading ? (
            <div className="state-center">
              <div className="spinner" role="status" aria-label="Loading" />
              <span className="state-center__sub">Loading applications…</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="state-center">
              <div className="state-center__icon" aria-hidden="true">📭</div>
              <p className="state-center__title">No applications found</p>
              <p className="state-center__sub">
                {search || statusFilter
                  ? 'Try clearing your search or filter.'
                  : 'No loan applications have been submitted yet.'}
              </p>
            </div>
          ) : (
            <table className="table" aria-label="Loan applications">
              <thead>
                <tr>
                  <th scope="col">Applicant</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Purpose</th>
                  <th scope="col">Language</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date Applied</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <ApplicationRow
                    key={app.id}
                    app={app}
                    onStatusChange={handleStatusChange}
                    updatingId={updatingId}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
