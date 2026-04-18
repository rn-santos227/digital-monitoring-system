export interface UpdateUserProfileRequest {
  personnelId?: string | null
  fullName?: string
  avatarUrl?: string | null
  accountTypeIds?: string[]
}

export interface CreateUserProfileRequest {
  email?: string
  fullName?: string
  avatarUrl?: string | null
  password?: string
  accountTypeIds?: string[]
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
