export const AUDIT_LOG_ACTIONS = {
  loginAttempt: 'LOGIN_ATTEMPT',
  login: 'LOGIN',
  logout: 'LOGOUT',
  accountTypeCreate: 'ACCOUNT_TYPE_CREATE',
  accountTypeUpdate: 'ACCOUNT_TYPE_UPDATE',
  accountTypeDelete: 'ACCOUNT_TYPE_DELETE',
  userProfileCreate: 'USER_PROFILE_CREATE',
  userProfileUpdate: 'USER_PROFILE_UPDATE',
  personnelCreate: 'PERSONNEL_CREATE',
  personnelUpdate: 'PERSONNEL_UPDATE',
  personnelDelete: 'PERSONNEL_DELETE',
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
  userProfilesCreate: '/api/users',
  userProfilesUpdate: '/api/users/:id',
  userProfilesPasswordUpdate: '/api/users/:id/password',
  userProfilesActivationUpdate: '/api/users/:id/activation',
  personnelCreate: '/api/personnel',
  personnelUpdate: '/api/personnel/:id',
  personnelDelete: '/api/personnel/:id',
} as const
