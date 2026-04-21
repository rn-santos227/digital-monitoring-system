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

export const USER_MANAGEMENT_API_ENDPOINTS = Object.freeze({
  userProfiles: '/api/users',
  userProfilesSearch: '/api/users/search',
  userPersonnelSuggestions: '/api/users/personnel-suggestions',
  userProfileById: (id: string) => `/api/users/${id}`,
  userProfilePassword: (id: string) => `/api/users/${id}/password`,
  userProfileActivation: (id: string) => `/api/users/${id}/activation`,
  accountTypes: '/api/account-types',
  accountTypesSearch: '/api/account-types/search',
  accountTypeById: (id: string) => `/api/account-types/${id}`,
  privileges: '/api/privileges',
})

export const PERSONNEL_API_ENDPOINTS = Object.freeze({
  personnel: '/api/personnel',
  personnelSearch: '/api/personnel/search',
  personnelById: (id: string) => `/api/personnel/${id}`,
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
  fetchAuditLogDetail: 'Loading audit log details...',
  fetchUserProfiles: 'Loading user profiles...',
  fetchUserAccounts: 'Loading user accounts...',
  fetchPrivileges: 'Loading privileges...',
  createUserProfile: 'Creating user profile...',
  updateUserProfile: 'Updating user profile...',
  updateUserPassword: 'Updating user password...',
  updateUserActivation: 'Updating user status...',
  deleteUserProfile: 'Deleting user profile...',
  createAccountType: 'Creating account type...',
  updateAccountType: 'Updating account type...',
  deleteAccountType: 'Deleting account type...',
  fetchPersonnel: 'Loading personnel records...',
  fetchPersonnelDetails: 'Loading personnel profile...',
  createPersonnel: 'Creating personnel record...',
})
