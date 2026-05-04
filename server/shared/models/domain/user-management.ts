export interface AccountTypePermissionSummary {
  id: string
  code: string
  name: string
  module: string
}

export interface AccountTypeListItem {
  id: string
  code: string
  name: string
  description: string | null
  isSystem: boolean
  createdAt: string
  updatedAt: string
  permissions: AccountTypePermissionSummary[]
}

export interface AccountTypeListResponse {
  items: AccountTypeListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface CreateAccountTypeBody {
  code?: string
  name?: string
  description?: string | null
  isSystem?: boolean
  permissionIds?: string[]
}

export interface UpdateAccountTypeBody {
  code?: string
  name?: string
  description?: string | null
  isSystem?: boolean
  permissionIds?: string[]
}

export interface PrivilegeListItem {
  id: string
  code: string
  name: string
  module: string
  isAssigned: boolean
}

export interface PrivilegeListResponse {
  items: PrivilegeListItem[]
}

export interface UserAccountTypeSummary {
  id: string
  code: string
  name: string
}

export interface UserProfileListItem {
  id: string
  personnelId: string | null
  email: string
  fullName: string
  avatarUrl: string | null
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  accountTypes: UserAccountTypeSummary[]
}

export interface CreateUserProfilePayload {
  personnelId: string | null
  email: string
  fullName: string
  avatarUrl: string | null
  password: string
  accountTypeIds: string[]
}

export interface UserProfileCreate {
  id: string
  personnel_id: string | null
  email: string
  full_name: string
  avatar_url: string | null
}

export interface UserProfileUpdate {
  personnel_id?: string | null
  full_name?: string
  avatar_url?: string | null
}
