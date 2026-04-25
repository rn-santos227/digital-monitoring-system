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
  userProfileById: (id: string) => `/api/users/${id}`,
  userProfilePassword: (id: string) => `/api/users/${id}/password`,
  userProfileActivation: (id: string) => `/api/users/${id}/activation`,
  accountTypes: '/api/account-types',
  accountTypesSearch: '/api/account-types/search',
  accountTypeById: (id: string) => `/api/account-types/${id}`,
  privileges: '/api/privileges',
})

export const UNIT_MANAGEMENT_API_ENDPOINTS = Object.freeze({
  battalions: '/api/battalions',
  battalionsSearch: '/api/battalions/search',
  battalionById: (id: string) => `/api/battalions/${id}`,
  companies: '/api/companies',
  companiesSearch: '/api/companies/search',
  companyById: (id: string) => `/api/companies/${id}`,
})

export const DASHBOARD_API_ENDPOINTS = Object.freeze({
  unitManagementKpis: '/api/dashboard/unit-management',
})

export const PERSONNEL_API_ENDPOINTS = Object.freeze({
  personnel: '/api/personnel',
  personnelSearch: '/api/personnel/search',
  personnelSuggestions: '/api/personnel/suggestions',
  personnelById: (id: string) => `/api/personnel/${id}`,
  ranks: '/api/ranks',
  rankSuggestions: '/api/ranks/suggestion',
  rankById: (id: string) => `/api/ranks/${id}`,
})

export const FILE_MANAGEMENT_API_ENDPOINTS = Object.freeze({
  upload: '/api/files/upload',
})

export const FILE_UPLOAD_CONSTRAINTS = Object.freeze({
  maxSizeBytes: 10 * 1024 * 1024,
  imageMimePrefixes: ['image/'],
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
  updatePersonnel: 'Updating personnel record...',
  deletePersonnel: 'Deleting personnel record...',
  fetchRanks: 'Loading rank records...',
  createRank: 'Creating rank record...',
  deleteRank: 'Deleting rank record...',
  fetchBattalions: 'Loading battalion records...',
  fetchCompanies: 'Loading company records...',
  fetchUnitManagementKpis: 'Loading unit KPIs...',
  createBattalion: 'Creating battalion record...',
  updateBattalion: 'Updating battalion record...',
  deleteBattalion: 'Deleting battalion record...',
  createCompany: 'Creating company record...',
  updateCompany: 'Updating company record...',
  deleteCompany: 'Deleting company record...',
  uploadFile: 'Uploading file...',
})
