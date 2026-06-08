const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const message = data?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export function submitApplication(payload) {
  return request('/api/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchApplications({ status, search } = {}) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  const qs = params.toString();
  return request(`/api/applications${qs ? `?${qs}` : ''}`);
}

export function updateApplicationStatus(id, status) {
  return request(`/api/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function fetchSummary() {
  return request('/api/summary');
}
