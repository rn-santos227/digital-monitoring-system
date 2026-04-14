export const AUDIT_LOG_ACTIONS = {
  loginAttempt: 'LOGIN_ATTEMPT',
  login: 'LOGIN',
  logout: 'LOGOUT',
} as const

export const AUDIT_LOG_OUTCOMES = {
  success: 'success',
  failed: 'failed',
} as const

export const AUDIT_LOG_ENDPOINTS = {
  authLogin: '/api/auth/login',
  authLogout: '/api/auth/logout',
} as const
