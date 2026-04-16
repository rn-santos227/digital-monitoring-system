export const AUDIT_LOG_ACTIONS = {
  loginAttempt: 'LOGIN_ATTEMPT',
  login: 'LOGIN',
  logout: 'LOGOUT',
  accountTypeCreate: 'ACCOUNT_TYPE_CREATE',
  accountTypeUpdate: 'ACCOUNT_TYPE_UPDATE',
  accountTypeDelete: 'ACCOUNT_TYPE_DELETE',
  userProfileUpdate: 'USER_PROFILE_UPDATE',
} as const

export const AUDIT_LOG_OUTCOMES = {
  success: 'success',
  failed: 'failed',
} as const

export const AUDIT_LOG_ENDPOINTS = {
  authLogin: '/api/auth/login',
  authLogout: '/api/auth/logout',
  accountTypesCreate: '/api/account-types',
  accountTypesUpdate: '/api/account-types/:id',
  accountTypesDelete: '/api/account-types/:id',
  userProfilesUpdate: '/api/user-profiles/:id',
} as const
