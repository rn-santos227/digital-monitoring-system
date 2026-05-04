export interface UpdateUserProfileRequest {
  personnelId?: string | null
  fullName?: string
  avatarUrl?: string | null
  isActive?: boolean
  accountTypeIds?: string[]
}

export interface CreateUserProfileRequest {
  personnelId?: string | null
  email?: string
  fullName?: string
  avatarUrl?: string | null
  password?: string
  accountTypeIds?: string[]
}

export interface UserPersonnelSuggestionsRequest {
  term?: string
  pageSize?: number
  selectedPersonnelId?: string
}

export interface CreateAccountTypeRequest {
  code?: string
  name?: string
  description?: string | null
  isSystem?: boolean
  permissionIds?: string[]
}

export interface UpdateAccountTypeRequest {
  code?: string
  name?: string
  description?: string | null
  isSystem?: boolean
  permissionIds?: string[]
}

export interface UpdateUserPasswordRequest {
  currentPassword?: string
  newPassword?: string
}

export interface UpdateUserActivationRequest {
  isActive?: boolean
}
