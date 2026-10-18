// Admin and CMS API Client with dynamic Demo Role injection
const API_BASE = '/api/admin';

let currentRole = localStorage.getItem('tw_admin_role') || 'superadmin';

export const setAdminRole = (role) => {
  currentRole = role;
  localStorage.setItem('tw_admin_role', role);
  window.dispatchEvent(new CustomEvent('tw_role_changed', { detail: role }));
};

export const getAdminRole = () => currentRole;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Demo-Role': currentRole,
});

export const adminApi = {
  // Current user & role
  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  // Dashboard Overview & Charts
  async getDashboardStats(period = 'month') {
    const res = await fetch(`${API_BASE}/stats?period=${period}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  async getActivities() {
    const res = await fetch(`${API_BASE}/activities`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  // Employees
  async getEmployees(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/employees${query ? `?${query}` : ''}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  async createEmployee(data) {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async updateEmployee(id, data) {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async deleteEmployee(id) {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  // Candidates
  async getCandidates(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/candidates${query ? `?${query}` : ''}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  async createCandidate(data) {
    const res = await fetch(`${API_BASE}/candidates`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async updateCandidateStatus(id, status) {
    const res = await fetch(`${API_BASE}/candidates/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async updateCandidate(id, data) {
    const res = await fetch(`${API_BASE}/candidates/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async deleteCandidate(id) {
    const res = await fetch(`${API_BASE}/candidates/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  // Clients
  async getClients(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/clients${query ? `?${query}` : ''}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  async createClient(data) {
    const res = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async updateClient(id, data) {
    const res = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async deleteClient(id) {
    const res = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  // Jobs
  async getJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/jobs${query ? `?${query}` : ''}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  async createJob(data) {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async updateJob(id, data) {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async deleteJob(id) {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  // Placements
  async getPlacements() {
    const res = await fetch(`${API_BASE}/placements`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  async createPlacement(data) {
    const res = await fetch(`${API_BASE}/placements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async updatePlacement(id, data) {
    const res = await fetch(`${API_BASE}/placements/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async deletePlacement(id) {
    const res = await fetch(`${API_BASE}/placements/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  // CMS Stats
  async getCmsStats() {
    const res = await fetch(`${API_BASE}/cms/stats`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  // CMS Pages
  async getCmsPages() {
    const res = await fetch(`${API_BASE}/cms/pages`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  async createCmsPage(data) {
    const res = await fetch(`${API_BASE}/cms/pages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async updateCmsPage(id, data) {
    const res = await fetch(`${API_BASE}/cms/pages/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async togglePublishCmsPage(id) {
    const res = await fetch(`${API_BASE}/cms/pages/${id}/publish`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async deleteCmsPage(id) {
    const res = await fetch(`${API_BASE}/cms/pages/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  // CMS Articles
  async getCmsArticles(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/cms/articles${query ? `?${query}` : ''}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  async createCmsArticle(data) {
    const res = await fetch(`${API_BASE}/cms/articles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async updateCmsArticle(id, data) {
    const res = await fetch(`${API_BASE}/cms/articles/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async togglePublishCmsArticle(id) {
    const res = await fetch(`${API_BASE}/cms/articles/${id}/publish`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async deleteCmsArticle(id) {
    const res = await fetch(`${API_BASE}/cms/articles/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  // CMS Media
  async getCmsMedia() {
    const res = await fetch(`${API_BASE}/cms/media`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  async createCmsMedia(data) {
    const res = await fetch(`${API_BASE}/cms/media`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async deleteCmsMedia(id) {
    const res = await fetch(`${API_BASE}/cms/media/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  // CMS SEO
  async getSeoSettings() {
    const res = await fetch(`${API_BASE}/cms/seo`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  async updateSeoSettings(data) {
    const res = await fetch(`${API_BASE}/cms/seo`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  // CMS Announcements
  async getAnnouncements() {
    const res = await fetch(`${API_BASE}/cms/announcements`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  async createAnnouncement(data) {
    const res = await fetch(`${API_BASE}/cms/announcements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async togglePublishAnnouncement(id) {
    const res = await fetch(`${API_BASE}/cms/announcements/${id}/publish`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async deleteAnnouncement(id) {
    const res = await fetch(`${API_BASE}/cms/announcements/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  // Tech Stack Catalog
  async getCmsTechStacks(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/cms/tech-stack${query ? `?${query}` : ''}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  async createCmsTechStack(data) {
    const res = await fetch(`${API_BASE}/cms/tech-stack`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async updateCmsTechStack(id, data) {
    const res = await fetch(`${API_BASE}/cms/tech-stack/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async toggleCmsTechStackFeatured(id) {
    const res = await fetch(`${API_BASE}/cms/tech-stack/${id}/feature`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async deleteCmsTechStack(id) {
    const res = await fetch(`${API_BASE}/cms/tech-stack/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  // System Members (Superadmin Exclusive)
  async getSystemMembers() {
    const res = await fetch(`${API_BASE}/system-members`, { headers: getHeaders() });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async createSystemMember(data) {
    const res = await fetch(`${API_BASE}/system-members`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async updateSystemMember(id, data) {
    const res = await fetch(`${API_BASE}/system-members/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },

  async deleteSystemMember(id) {
    const res = await fetch(`${API_BASE}/system-members/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP error ${res.status}`);
    return json;
  },
};

export default adminApi;
