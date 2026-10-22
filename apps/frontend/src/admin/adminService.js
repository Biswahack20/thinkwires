// Admin and CMS API Client with HttpOnly Cookie & Double-Submit CSRF Protection
const API_BASE = '/api/admin';

// In-memory session and CSRF state
let currentAdminUser = null;
let inMemoryCsrfToken = null;

// Immediately sanitize and purge any legacy insecure JWT from localStorage
try {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('tw_admin_token');
    localStorage.removeItem('tw_admin_role');
  }
} catch {
  // Ignore in non-browser environments
}

/**
 * Legacy token reader maintained for backward compatibility.
 * Strictly returns null because the JWT is now isolated inside HttpOnly cookies.
 */
export const getAdminToken = () => {
  return null;
};

/**
 * Retrieve non-sensitive authenticated user profile from memory or session storage.
 */
export const getAdminUser = () => {
  if (currentAdminUser) return currentAdminUser;
  try {
    if (typeof sessionStorage !== 'undefined') {
      const raw = sessionStorage.getItem('tw_admin_user');
      if (raw) {
        currentAdminUser = JSON.parse(raw);
        return currentAdminUser;
      }
    }
  } catch {
    return null;
  }
  return null;
};

/**
 * Retrieve current active admin role in lowercase
 */
export const getAdminRole = () => {
  const user = getAdminUser();
  return user?.role ? user.role.toLowerCase() : '';
};

/**
 * Retrieve CSRF token from memory or double-submit cookie
 */
export const getCsrfToken = () => {
  if (inMemoryCsrfToken) return inMemoryCsrfToken;
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)tw_admin_csrf=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  return null;
};

/**
 * Update active in-memory CSRF token
 */
export const setCsrfToken = (token) => {
  inMemoryCsrfToken = token || null;
};

/**
 * Set active admin session (stores non-sensitive user metadata in memory/sessionStorage).
 * JWT token is never stored in client storage.
 */
export const setAdminSession = (userOrToken, maybeUser) => {
  // Support both (user, csrfToken) and legacy (token, user) caller signatures
  let user = userOrToken;
  let csrf = null;

  if (typeof userOrToken === 'string') {
    // Legacy signature (token, user)
    user = maybeUser;
  } else if (maybeUser && typeof maybeUser === 'string') {
    csrf = maybeUser;
  }

  if (csrf) {
    setCsrfToken(csrf);
  }

  if (user) {
    currentAdminUser = user;
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('tw_admin_user', JSON.stringify(user));
        sessionStorage.setItem(
          'tw_admin_role',
          user.role ? user.role.toLowerCase() : ''
        );
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('tw_admin_token');
        localStorage.removeItem('tw_admin_user');
        localStorage.removeItem('tw_admin_role');
      }
    } catch (e) {
      console.warn('Could not persist non-sensitive session metadata:', e);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('tw_admin_auth_changed', { detail: { user } })
    );
  }
};

/**
 * Terminate client session state and remove cached user metadata.
 */
export const clearAdminSession = () => {
  currentAdminUser = null;
  inMemoryCsrfToken = null;
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('tw_admin_user');
      sessionStorage.removeItem('tw_admin_role');
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('tw_admin_token');
      localStorage.removeItem('tw_admin_user');
      localStorage.removeItem('tw_admin_role');
    }
  } catch (e) {
    console.warn('Session clearance storage notice:', e);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('tw_admin_auth_changed', { detail: null })
    );
  }
};

/**
 * Verify whether an admin profile is active in client state
 */
export const isAdminAuthenticated = () => {
  return Boolean(getAdminUser());
};

/**
 * Legacy setter maintained for role-switching demonstrations
 */
export const setAdminRole = (role) => {
  const user = getAdminUser();
  if (user) {
    user.role = role;
    currentAdminUser = user;
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('tw_admin_user', JSON.stringify(user));
        sessionStorage.setItem('tw_admin_role', role);
      }
    } catch {}
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tw_role_changed', { detail: role }));
  }
};

/**
 * Construct default secure headers with CSRF protection
 */
export const getHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...customHeaders,
  };
  const csrf = getCsrfToken();
  if (csrf) {
    headers['X-CSRF-Token'] = csrf;
  }
  return headers;
};

/**
 * Centralized, secure request executor with automatic credential transmission,
 * CSRF injection, and 401 unauthenticated interception.
 */
async function request(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = getHeaders(options.headers || {});

  // For state-changing methods, guarantee CSRF token is attached
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && !headers['X-CSRF-Token']) {
    const csrf = getCsrfToken();
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Transmit HttpOnly cookies
  });

  if (res.status === 401) {
    clearAdminSession();
    const json = await res.json().catch(() => ({}));
    const error = new Error(
      json.error || 'Authentication required. Please log in again.'
    );
    error.status = 401;
    error.data = json;
    throw error;
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(json.error || `HTTP error ${res.status}`);
    error.status = res.status;
    error.data = json;
    throw error;
  }

  return json;
}

export const adminApi = {
  // Authentication
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include', // Server will respond with Set-Cookie for HttpOnly JWT
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `Login failed (${res.status})`);

    if (json.csrfToken) {
      setCsrfToken(json.csrfToken);
    }
    if (json.user) {
      setAdminSession(json.user, json.csrfToken);
    }
    return json;
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
      });
    } catch (e) {
      console.warn('Logout network notice:', e.message);
    } finally {
      clearAdminSession();
    }
    return { success: true };
  },

  // Current user & session restoration
  async getMe() {
    const data = await request('/auth/me');
    if (data && data.csrfToken) {
      setCsrfToken(data.csrfToken);
    }
    if (data && data.user) {
      setAdminSession(data.user, data.csrfToken);
    }
    return data;
  },

  async getCsrf() {
    const data = await request('/auth/csrf');
    if (data && data.csrfToken) {
      setCsrfToken(data.csrfToken);
    }
    return data;
  },

  // Dashboard Overview & Charts
  async getDashboardStats(period = 'month') {
    return request(`/stats?period=${period}`);
  },

  async getActivities() {
    return request('/activities');
  },

  // Employees
  async getEmployees(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/employees${query ? `?${query}` : ''}`);
  },

  async createEmployee(data) {
    return request('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateEmployee(id, data) {
    return request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteEmployee(id) {
    return request(`/employees/${id}`, {
      method: 'DELETE',
    });
  },

  // Candidates
  async getCandidates(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/candidates${query ? `?${query}` : ''}`);
  },

  async createCandidate(data) {
    return request('/candidates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCandidateStatus(id, status) {
    return request(`/candidates/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async updateCandidate(id, data) {
    return request(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCandidate(id) {
    return request(`/candidates/${id}`, {
      method: 'DELETE',
    });
  },

  // Clients
  async getClients(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/clients${query ? `?${query}` : ''}`);
  },

  async createClient(data) {
    return request('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateClient(id, data) {
    return request(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteClient(id) {
    return request(`/clients/${id}`, {
      method: 'DELETE',
    });
  },

  // Jobs
  async getJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/jobs${query ? `?${query}` : ''}`);
  },

  async createJob(data) {
    return request('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateJob(id, data) {
    return request(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteJob(id) {
    return request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  // Placements
  async getPlacements() {
    return request('/placements');
  },

  async createPlacement(data) {
    return request('/placements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePlacement(id, data) {
    return request(`/placements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deletePlacement(id) {
    return request(`/placements/${id}`, {
      method: 'DELETE',
    });
  },

  // CMS Stats
  async getCmsStats() {
    return request('/cms/stats');
  },

  // CMS Pages
  async getCmsPages() {
    return request('/cms/pages');
  },

  async createCmsPage(data) {
    return request('/cms/pages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCmsPage(id, data) {
    return request(`/cms/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async togglePublishCmsPage(id) {
    return request(`/cms/pages/${id}/publish`, {
      method: 'PATCH',
    });
  },

  async deleteCmsPage(id) {
    return request(`/cms/pages/${id}`, {
      method: 'DELETE',
    });
  },

  // CMS Articles
  async getCmsArticles(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/cms/articles${query ? `?${query}` : ''}`);
  },

  async createCmsArticle(data) {
    return request('/cms/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCmsArticle(id, data) {
    return request(`/cms/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async togglePublishCmsArticle(id) {
    return request(`/cms/articles/${id}/publish`, {
      method: 'PATCH',
    });
  },

  async deleteCmsArticle(id) {
    return request(`/cms/articles/${id}`, {
      method: 'DELETE',
    });
  },

  // CMS Media
  async getCmsMedia() {
    return request('/cms/media');
  },

  async createCmsMedia(data) {
    return request('/cms/media', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteCmsMedia(id) {
    return request(`/cms/media/${id}`, {
      method: 'DELETE',
    });
  },

  // CMS SEO
  async getSeoSettings() {
    return request('/cms/seo');
  },

  async updateSeoSettings(data) {
    return request('/cms/seo', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // CMS Announcements
  async getAnnouncements() {
    return request('/cms/announcements');
  },

  async createAnnouncement(data) {
    return request('/cms/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async togglePublishAnnouncement(id) {
    return request(`/cms/announcements/${id}/publish`, {
      method: 'PATCH',
    });
  },

  async deleteAnnouncement(id) {
    return request(`/cms/announcements/${id}`, {
      method: 'DELETE',
    });
  },

  // System Members (Superadmin Exclusive)
  async getSystemMembers() {
    return request('/system-members');
  },

  async createSystemMember(data) {
    return request('/system-members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSystemMember(id, data) {
    return request(`/system-members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteSystemMember(id) {
    return request(`/system-members/${id}`, {
      method: 'DELETE',
    });
  },
};

export default adminApi;
