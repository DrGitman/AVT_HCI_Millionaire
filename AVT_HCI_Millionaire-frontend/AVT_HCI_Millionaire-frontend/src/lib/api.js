const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function request(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const message = payload?.detail || payload?.message || 'Request failed'
    throw new Error(message)
  }

  return payload
}

export const api = {
  request,
  login: (body) => request('/auth/login', { method: 'POST', body }),
  register: (body) => request('/auth/register', { method: 'POST', body }),
  leaderboard: () => request('/leaderboard', { token: localStorage.getItem('hci_token') }),
  me: () => request('/users/me', { token: localStorage.getItem('hci_token') }),
}

export function saveAuthTokens(tokens) {
  localStorage.setItem('hci_token', tokens.access_token)
  localStorage.setItem('hci_refresh_token', tokens.refresh_token)
}

export function getAuthToken() {
  return localStorage.getItem('hci_token')
}
