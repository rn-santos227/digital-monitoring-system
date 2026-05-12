import { AccountTypeListItem, UserProfileListItem } from "../../models"

export interface UserListAccountTypeSummary {
  code: string
}

export interface UserProfileListItemCompact {
  id: string
  email: string
  fullName: string
  isActive: boolean
  lastLoginAt: string | null
  accountTypes: UserListAccountTypeSummary[]
}

export interface UserProfileListCompactResponse {
  items: UserProfileListItemCompact[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface UserDetailAccountTypeSummary {
  id: string
  code: string
  name: string
}

export interface UserProfileDetailResponse {
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
  accountTypes: UserDetailAccountTypeSummary[]
}

export interface MutationSuccessResponse {
  ok: true
}

export interface CreateAccountTypeResponse {
  ok: true
  id: string
  item: AccountTypeListItem
}

export interface CreateUserProfileResponse {
  ok: true
  id: string
  item: UserProfileListItem
}

export interface AccountTypeDetailPermissionResponse {
  id: string
  code: string
  name: string
  module: string
}

export interface AccountTypeDetailResponse {
  id: string
  code: string
  name: string
  description: string | null
  isSystem: boolean
  permissions: AccountTypeDetailPermissionResponse[]
}
