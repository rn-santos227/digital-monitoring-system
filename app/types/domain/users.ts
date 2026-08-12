export type UserManagementTabId = 'user-profile' | 'user-account'
export type UserProfileViewTabId = 'details' | 'activities'

export interface UserProfileRecord {
  id: string
  email: string
  fullName: string
  isActive: boolean
  lastLoginAt: string | null
  accountTypeCodes: string[]
}

export interface UserProfileDetailRecord {
  id: string
  personnelId: string | null
  email: string
  fullName: string
  avatarUrl: string | null
  isActive: boolean
  accountTypeIds: string[]
}

export interface UserProfileViewRecord {
  id: string
  personnelId: string | null
  email: string
  fullName: string
  avatarUrl: string | null
  isActive: boolean
  lastLoginAt: string | null
  passwordUpdatedAt: string | null
  createdAt: string
  updatedAt: string
  accountTypes: Array<{ id: string; code: string; name: string }>
}
export interface UserAccountRecord {
  id: string
  code: string
  name: string
  description: string | null
  isSystem: boolean
}

export interface UserAccountDetailRecord {
  id: string
  code: string
  name: string
  description: string | null
  isSystem: boolean
  permissionIds: string[]
}

export type UserProfileBulkUpdateValues = Partial<{
  avatar_url: string | null
  is_active: boolean
}>

export type AccountTypeBulkUpdateValues = Partial<{
  description: string | null
  is_system: boolean
}>

export interface PrivilegeRecord {
  id: string
  code: string
  name: string
  module: string
  isAssigned: boolean
}

export interface UsersTablePagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface UserManagementKpiCounts {
  activeUsers: number
  inactiveUsers: number
  totalAccountTypes: number
  unusedAccountTypes: number
}

export interface UsersState {
  profileItems: UserProfileRecord[]
  accountItems: UserAccountRecord[]
  privilegeItems: PrivilegeRecord[]
  kpis: UserManagementKpiCounts
  hasLoadedKpis: boolean
  profilePagination: UsersTablePagination
  accountPagination: UsersTablePagination
  isLoading: boolean
  error: string
}

export interface UserProfilesSearchQuery extends UserProfilesEndpointQuery {
  term?: string
  fields?: string
}

export interface UserProfilesEndpointQuery {
  page?: number
  pageSize?: number
  search?: string
  isActive?: boolean
}

export interface UserProfileCompactResponseItem {
  id: string
  email: string
  fullName: string
  isActive: boolean
  lastLoginAt: string | null
  accountTypes: Array<{ code: string }>
}

export interface UserProfilesEndpointResponse {
  items: UserProfileCompactResponseItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface UserProfileDetailEndpointResponse {
  id: string
  personnelId: string | null
  email: string
  fullName: string
  avatarUrl: string | null
  isActive: boolean
  accountTypes: Array<{ id: string; code: string; name: string }>
}

export interface UserProfileViewEndpointResponse {
  id: string
  personnelId: string | null
  email: string
  fullName: string
  avatarUrl: string | null
  isActive: boolean
  lastLoginAt: string | null
  passwordUpdatedAt: string | null
  createdAt: string
  updatedAt: string
  accountTypes: Array<{ id: string; code: string; name: string }>
}

export interface UserAccountsEndpointQuery {
  page?: number
  pageSize?: number
  search?: string
  includeSystem?: boolean
}

export interface UserAccountsSearchQuery extends UserAccountsEndpointQuery {
  term?: string
  fields?: string
  isSystem?: boolean
}

export interface UserAccountEndpointResponseItem {
  id: string
  code: string
  name: string
  description: string | null
  isSystem: boolean
}

export interface UserAccountsEndpointResponse {
  items: UserAccountEndpointResponseItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface CreateUserProfilePayload {
  personnelId: string | null
  email: string
  fullName: string
  avatarUrl: string | null
  password: string
  accountTypeIds: string[]
}

export interface UpdateUserProfilePayload {
  personnelId: string | null
  email?: string
  fullName?: string
  avatarUrl?: string | null
  accountTypeIds?: string[]
}

export interface UpdateUserPasswordPayload {
  currentPassword?: string
  newPassword: string
}

export interface UpdateUserActivationPayload {
  isActive: boolean
}

export interface CreateAccountTypePayload {
  code: string
  name: string
  description: string | null
  isSystem: boolean
  permissionIds: string[]
}

export interface UpdateAccountTypePayload {
  code: string
  name: string
  description: string | null
  isSystem: boolean
  permissionIds: string[]
}

export interface PrivilegesEndpointResponse {
  items: PrivilegeRecord[]
}

export interface UserAccountDetailEndpointResponse {
  id: string
  code: string
  name: string
  description: string | null
  isSystem: boolean
  permissions: Array<{ id: string; code: string; name: string; module: string }>
}
