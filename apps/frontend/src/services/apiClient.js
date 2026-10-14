const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const isMockModeEnabled = () => {
  const envVal = import.meta.env.VITE_USE_MOCK_DATA;
  if (envVal === 'false' || envVal === false) return false;
  return true; // default to resilient mock mode if backend is not explicitly running
};

export const apiClient = {
  async get(endpoint) {
    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async post(endpoint, data) {
    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(errorJson.error || errorJson.message || `API error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
};

export default apiClient;
