const API_BASE = 'http://localhost:8000/api';

function getToken() {
  return localStorage.getItem('vidvault_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(endpoint, options = {}) {
  const { method = 'GET', body, auth = false } = options;
  const headers = { 'Content-Type': 'application/json' };
  if (auth) Object.assign(headers, authHeaders());

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.error || `API Error ${res.status}`);
  }
  return res.json();
}

// Videos
export const getVideos = (params = '') => apiFetch(`/videos/${params ? '?' + params : ''}`);
export const getVideo = (id) => apiFetch(`/videos/${id}/`);
export const getFeaturedVideos = () => apiFetch('/videos/featured/');
export const getTrendingVideos = () => apiFetch('/videos/trending/');
export const getLatestVideos = () => apiFetch('/videos/latest/');
export const getVideosByCategory = () => apiFetch('/videos/by_category/');
export const incrementView = (id) => apiFetch(`/videos/${id}/increment_view/`, { method: 'POST' });
export const getStats = () => apiFetch('/videos/stats/', { auth: true });
export const createVideo = (data) => apiFetch('/videos/', { method: 'POST', body: data, auth: true });
export const updateVideo = (id, data) => apiFetch(`/videos/${id}/`, { method: 'PUT', body: data, auth: true });
export const deleteVideo = (id) => apiFetch(`/videos/${id}/`, { method: 'DELETE', auth: true });

// Categories
export const getCategories = () => apiFetch('/categories/');
export const createCategory = (data) => apiFetch('/categories/', { method: 'POST', body: data, auth: true });
export const deleteCategory = (id) => apiFetch(`/categories/${id}/`, { method: 'DELETE', auth: true });

// Search
export const searchVideos = (params) => apiFetch(`/search/?${params}`);

// YouTube
export const fetchYouTubeData = (url) => apiFetch('/youtube/fetch/', { method: 'POST', body: { url }, auth: true });

// Auth
export async function loginAdmin(username, password) {
  const res = await fetch(`${API_BASE}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  localStorage.setItem('vidvault_token', data.access);
  localStorage.setItem('vidvault_refresh', data.refresh);
  return data;
}

export function logoutAdmin() {
  localStorage.removeItem('vidvault_token');
  localStorage.removeItem('vidvault_refresh');
}

export function isLoggedIn() {
  return !!getToken();
}
