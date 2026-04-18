export type UserManagementTabId = 'user-profile' | 'user-account'

export interface UserProfileRecord {
  id: string
  email: string
  fullName: string
  isActive: boolean
  lastLoginAt: string | null
  accountTypeCodes: string[]
}

export interface UserAccountRecord {
  id: string
  code: string
  name: string
  description: string | null
  isSystem: boolean
}

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

export interface UsersState {
  profileItems: UserProfileRecord[]
  accountItems: UserAccountRecord[]
  privilegeItems: PrivilegeRecord[]
  profilePagination: UsersTablePagination
  accountPagination: UsersTablePagination
  isLoading: boolean
  error: string
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

export interface UserAccountsEndpointQuery {
  page?: number
  pageSize?: number
  search?: string
  includeSystem?: boolean
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
  email: string
  fullName: string
  avatarUrl: string | null
  password: string
  accountTypeIds: string[]
}

export interface CreateAccountTypePayload {
  code: string
  name: string
  description: string | null
  isSystem: boolean
  permissionIds: string[]
}

export interface PrivilegesEndpointResponse {
  items: PrivilegeRecord[]
}
