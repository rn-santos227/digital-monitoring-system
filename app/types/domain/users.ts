export type UserManagementTabId = 'user-profile' | 'user-account'

export interface UserProfileRecord {
  id: string
  fullName: string
  battalion: string
  company: string
  rank: string
  status: 'Active' | 'Reserve'
}

export interface UserAccountRecord {
  id: string
  username: string
  email: string
  role: string
  accountStatus: 'Enabled' | 'Locked'
}

export interface UsersState {
  profileItems: UserProfileRecord[]
  accountItems: UserAccountRecord[]
  isLoading: boolean
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
