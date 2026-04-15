export const AUTH_API_ENDPOINTS = Object.freeze({
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  session: '/api/auth/session'
})

export const AUDIT_API_ENDPOINTS = Object.freeze({
  logs: '/api/audit/logs',
  search: '/api/audit/search',
  logById: (id: string) => `/api/audit/logs/${id}`
})

export const AUTH_LOCAL_STORAGE_KEYS = Object.freeze({
  sessionToken: 'dms_session_token',
  sessionTokenExpiresAt: 'dms_session_token_expires_at'
})

export const AUTH_HEADERS = Object.freeze({
  sessionToken: 'x-dms-session-token'
})

export const API_LOADING_MESSAGES = Object.freeze({
  authenticate: 'Signing in...',
  fetchSession: 'Validating session...',
  logout: 'Signing out...',
  fetchAuditLogs: 'Loading audit logs...',
  fetchAuditLogDetail: 'Loading audit log details...'
})
