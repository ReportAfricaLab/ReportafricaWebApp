const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('obs_token');
}

async function authFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (res.status === 401) {
    if (typeof window !== 'undefined') { localStorage.removeItem('obs_token'); window.location.href = '/'; }
  }
  return res.json();
}

export const observerAPI = {
  login: (email: string, password: string) => authFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: any) => authFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  // Observer-specific
  registerObserver: (data: { orgName?: string; country: string; tier: string; accreditationUrl: string }) => authFetch('/observers/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => authFetch('/observers/me'),
  getSubscription: (country: string) => authFetch(`/observers/subscription?country=${country}`),
  pay: (country: string, email: string) => authFetch('/observers/pay', { method: 'POST', body: JSON.stringify({ country, email }) }),
  verifyPayment: (reference: string) => authFetch(`/observers/verify/${reference}`),
  inviteSeat: (country: string, userId: string) => authFetch('/observers/invite-seat', { method: 'POST', body: JSON.stringify({ country, userId }) }),
  getSeats: (country: string) => authFetch(`/observers/seats?country=${country}`),
  // Election data (uses observer guard on backend via country param)
  getResults: (country: string, election: string) => authFetch(`/elections/results?country=${country}&election=${encodeURIComponent(election)}`),
  getFeed: (country: string, election: string, page = 1) => authFetch(`/elections/feed?country=${country}&election=${encodeURIComponent(election)}&page=${page}`),
  getParallelCount: (country: string, election: string) => authFetch(`/elections/parallel-count?country=${country}&election=${encodeURIComponent(election)}`),
  getHotspots: (country: string, election: string) => authFetch(`/elections/hotspots?country=${country}&election=${encodeURIComponent(election)}`),
  getHotspotsGeo: (country: string, election: string) => authFetch(`/elections/hotspots-geo?country=${country}&election=${encodeURIComponent(election)}`),
  getIncidents: (country: string) => authFetch(`/elections/incidents?country=${country}`),
};
