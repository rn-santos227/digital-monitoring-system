import { createError } from 'h3'
import type { UpdateUserActivationRequest, UpdateUserPasswordRequest, UpdateUserProfileRequest } from '../../requests/domain/user-management'
import { normalizeOptionalText } from '../../utils'

const PASSWORD_MIN_LENGTH = 8

export const requireRouteId = (id: string | undefined, message: string): string => {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: message })
  }

  return id
}

export const buildUserProfileUpdates = (body: UpdateUserProfileRequest) => {
  const updates: {
    personnel_id?: string | null
    full_name?: string
    avatar_url?: string | null
  } = {}

  if (body.personnelId !== undefined) {
    updates.personnel_id = body.personnelId
  }

  if (body.fullName !== undefined) {
    const fullName = normalizeOptionalText(body.fullName)

    if (!fullName) {
      throw createError({ statusCode: 400, statusMessage: 'Full name cannot be empty.' })
    }

    updates.full_name = fullName
  }

  if (body.avatarUrl !== undefined) {
    updates.avatar_url = typeof body.avatarUrl === 'string' ? normalizeOptionalText(body.avatarUrl) : null
  }

  return updates
}

export const normalizeAccountTypeIds = (accountTypeIds: unknown): string[] | null => {
  if (!Array.isArray(accountTypeIds)) {
    return null
  }

  return [...new Set(accountTypeIds.filter((accountTypeId): accountTypeId is string => typeof accountTypeId === 'string' && accountTypeId.length > 0))]
}

export const parsePasswordUpdatePayload = (body: UpdateUserPasswordRequest) => {
  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : null
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword.trim() : ''

  if (!newPassword || newPassword.length < PASSWORD_MIN_LENGTH) {
    throw createError({ statusCode: 400, statusMessage: `New password must be at least ${PASSWORD_MIN_LENGTH} characters.` })
  }

  return {
    currentPassword,
    newPassword,
  }
}

export const parseActivationPayload = (body: UpdateUserActivationRequest): boolean => {
  if (typeof body.isActive !== 'boolean') {
    throw createError({ statusCode: 400, statusMessage: 'isActive must be provided as a boolean.' })
  }

  return body.isActive
}
