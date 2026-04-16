export interface UpdateUserProfileRequest {
  personnelId?: string | null
  fullName?: string
  avatarUrl?: string | null
  accountTypeIds?: string[]
}

export interface UpdateUserPasswordRequest {
  currentPassword?: string
  newPassword?: string
}

export interface UpdateUserActivationRequest {
  isActive?: boolean
}
