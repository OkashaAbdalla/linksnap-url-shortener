const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
export const SHORT_URL_BASE = import.meta.env.VITE_SHORT_URL_BASE || "http://localhost:3001";

const TOKEN_KEY = "snaplink-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(endpoint, options = {}, requiresAuth = true) {
  const headers = { "Content-Type": "application/json" };
  
  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers,
    ...options,
  });
  
if (res.status === 401) {
  removeToken();
  throw new Error("Unauthorized");
}

  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Request failed");
  }
  
  return res.json();
}

export const api = {
  // Auth
  register: (email, password, name) => 
    request("/auth/register", { method: "POST", body: JSON.stringify({ email, password, name }) }, false),
  
  login: (email, password) => 
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }, false),
  
  getMe: () => 
    request("/auth/me"),
  
  // Links
  createLink: (url, customSlug) => 
    request("/links", { method: "POST", body: JSON.stringify({ url, customSlug }) }),
  
  getLinks: (limit = 50, offset = 0) => 
    request(`/links?limit=${limit}&offset=${offset}`),
  
  deleteLink: (id) => 
    request(`/links/${id}`, { method: "DELETE" }),
  
  // Stats
  getStats: () => 
    request("/stats"),
  
  getLinkStats: (id, days = 30) => 
    request(`/stats/link/${id}?days=${days}`),
};
