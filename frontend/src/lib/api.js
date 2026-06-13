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

  // Game Actions
  startGame: (categoryIds, maxPlayers = 1) => request('/game/start', {
    method: 'POST',
    body: { categoryIds, maxPlayers },
    token: localStorage.getItem('hci_token')
  }),
  joinGame: (roomCode) => request(`/game/join/${roomCode}`, {
    method: 'POST',
    token: localStorage.getItem('hci_token')
  }),
  getGameState: (gameId) => request(`/game/${gameId}/state`, {
    token: localStorage.getItem('hci_token')
  }),
  submitAnswer: (gameId, questionId, answerId, sequence) => request(`/game/${gameId}/answer`, {
    method: 'POST',
    body: { QuestionId: questionId, AnswerId: answerId, questionSequence: sequence },
    token: localStorage.getItem('hci_token')
  }),
  endGame: (gameId) => request(`/game/${gameId}/end`, {
    method: 'POST',
    token: localStorage.getItem('hci_token')
  }),

  // Lifelines
  use5050: (gameId, questionId) => request(`/lifelines/fifty-fifty/${gameId}/${questionId}`, {
    token: localStorage.getItem('hci_token')
  }),
  useSage: (gameId, questionId) => request(`/lifelines/sage/${gameId}/${questionId}`, {
    token: localStorage.getItem('hci_token')
  }),
  usePhone: (gameId, questionId) => request(`/lifelines/phone-a-peer/${gameId}/${questionId}`, {
    token: localStorage.getItem('hci_token')
  }),
  voteClass: (gameId, questionId, answerId) => request('/lifelines/ask-the-class', {
    method: 'POST',
    body: { GameId: gameId, QuestionId: questionId, AnswerId: answerId },
    token: localStorage.getItem('hci_token')
  }),
  getClassResults: (gameId, questionId) => request(`/lifelines/ask-the-class/${gameId}/${questionId}`, {
    token: localStorage.getItem('hci_token')
  }),

  // Questions
  getCategories: () => request('/questions/categories', {
    token: localStorage.getItem('hci_token')
  }),
}

export function saveAuthTokens(tokens) {
  localStorage.setItem('hci_token', tokens.access_token)
  localStorage.setItem('hci_refresh_token', tokens.refresh_token)
}

export function getAuthToken() {
  return localStorage.getItem('hci_token')
}
