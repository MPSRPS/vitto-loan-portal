import { useState } from 'react';
import { submitApplication } from '../api/applications';

const INITIAL = { name: '', mobile: '', amount: '', purpose: '', language: '' };

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Full name is required.';
  if (!/^\d{10}$/.test(v.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number.';
  if (!v.amount || parseFloat(v.amount) <= 0) e.amount = 'Enter a positive loan amount.';
  if (!v.purpose.trim()) e.purpose = 'Loan purpose is required.';
  if (!v.language) e.language = 'Please select a preferred language.';
  return e;
}

export default function ApplyPage() {
  const [form, setForm] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState('');
  const [created, setCreated] = useState(null);

  const errors = validate(form);

  function change(e) { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); }
  function blur(e) { setTouched((p) => ({ ...p, [e.target.name]: true })); }

  async function submit(e) {
    e.preventDefault();
    setTouched({ name: true, mobile: true, amount: true, purpose: true, language: true });
    if (Object.keys(errors).length) return;
    setLoading(true); setApiErr('');
    try {
      const res = await submitApplication({
        name: form.name.trim(), mobile: form.mobile.trim(),
        amount: parseFloat(form.amount),
        purpose: form.purpose.trim(), language: form.language,
      });
      setCreated(res.data);
      setForm(INITIAL); setTouched({});
    } catch (err) { setApiErr(err.message); }
    finally { setLoading(false); }
  }

  if (created) {
    return (
      <div>
        <div className="page-header">
          <h1>Application <span className="gradient-text">Submitted</span></h1>
          <p>The loan application has been successfully recorded.</p>
        </div>
        <div className="success-card" role="alert">
          <div className="success-card__check" aria-hidden="true">✓</div>
          <h2 className="success-card__title">Application Received</h2>
          <p className="success-card__sub">
            This application is now visible on the operations dashboard and pending review.
          </p>
          <div className="success-card__ref">
            <div className="success-card__ref-label">Reference Number</div>
            <div className="success-card__ref-val" id="ref-number">{created.id}</div>
          </div>
          <button
            id="apply-another-btn"
            className="btn btn--primary"
            style={{ width: '100%' }}
            onClick={() => setCreated(null)}
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>New Loan <span className="gradient-text">Application</span></h1>
        <p>Complete the form below on behalf of the borrower.</p>
      </div>

      <div className="apply-layout">
        {/* Left info panel */}
        <div className="apply-info">
          <div className="apply-info__badge">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="5" cy="5" r="5" />
            </svg>
            Field Agent Tool
          </div>
          <h2>Record a borrower's loan application</h2>
          <p>
            This form captures all required details for the operations team to review.
            Ensure all information is verified with the borrower before submitting.
          </p>

        </div>

        {/* Form */}
        <div className="form-card">
          <form className="form" onSubmit={submit} noValidate id="loan-application-form">
            {apiErr && (
              <div className="alert alert--error" role="alert">
                <span aria-hidden="true">⚠</span> {apiErr}
              </div>
            )}

            <div className="form__section-title">Borrower Details</div>

            <div className={`field${touched.name && errors.name ? ' field--error' : ''}`}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name" name="name" type="text"
                placeholder="e.g. Priya Sharma"
                value={form.name} onChange={change} onBlur={blur}
                autoComplete="name"
              />
              {touched.name && errors.name && (
                <span className="field__err" id="name-err" role="alert">{errors.name}</span>
              )}
            </div>

            <div className={`field${touched.mobile && errors.mobile ? ' field--error' : ''}`}>
              <label htmlFor="mobile">Mobile Number</label>
              <input
                id="mobile" name="mobile" type="tel"
                placeholder="10-digit number"
                value={form.mobile} onChange={change} onBlur={blur}
                autoComplete="tel" inputMode="numeric" maxLength={10}
              />
              {touched.mobile && errors.mobile && (
                <span className="field__err" id="mobile-err" role="alert">{errors.mobile}</span>
              )}
            </div>

            <div className={`field${touched.language && errors.language ? ' field--error' : ''}`}>
              <label htmlFor="language">Preferred Language</label>
              <select
                id="language" name="language"
                value={form.language} onChange={change} onBlur={blur}
              >
                <option value="" disabled>Select borrower's language</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Marathi">Marathi</option>
                <option value="English">English</option>
              </select>
              {touched.language && errors.language && (
                <span className="field__err" id="language-err" role="alert">{errors.language}</span>
              )}
            </div>

            <div className="divider" />
            <div className="form__section-title">Loan Details</div>

            <div className={`field${touched.amount && errors.amount ? ' field--error' : ''}`}>
              <label htmlFor="amount">Loan Amount (₹)</label>
              <input
                id="amount" name="amount" type="number"
                min="1" step="0.01"
                placeholder="e.g. 50000"
                value={form.amount} onChange={change} onBlur={blur}
                inputMode="decimal"
              />
              {touched.amount && errors.amount && (
                <span className="field__err" id="amount-err" role="alert">{errors.amount}</span>
              )}
            </div>

            <div className={`field${touched.purpose && errors.purpose ? ' field--error' : ''}`}>
              <label htmlFor="purpose">Loan Purpose</label>
              <input
                id="purpose" name="purpose" type="text"
                placeholder="e.g. Medical emergency, Farm equipment"
                value={form.purpose} onChange={change} onBlur={blur}
              />
              {touched.purpose && errors.purpose && (
                <span className="field__err" id="purpose-err" role="alert">{errors.purpose}</span>
              )}
            </div>

            <button
              id="submit-application-btn"
              type="submit"
              className="btn btn--primary"
              disabled={loading}
              aria-busy={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
