import { createError } from 'h3'
import type { UserProfileUpdate, CreateUserProfilePayload  } from '../../models/domain/user-management'
import type {
  CreateAccountTypeRequest,
  CreateUserProfileRequest,
  UpdateUserActivationRequest,
  UpdateUserPasswordRequest,
  UpdateUserProfileRequest,
} from '../../requests/domain/user-management'
import { isValidEmail, normalizeOptionalText } from '../../utils'

const PASSWORD_MIN_LENGTH = 8

export const requireRouteId = (id: string | undefined, message: string): string => {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: message })
  }

  return id
}
export const buildUserProfileUpdates = (body: UpdateUserProfileRequest): UserProfileUpdate => {
  const updates: UserProfileUpdate = {}

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
  return normalizeUniqueStringArray(accountTypeIds)
}

const normalizeUniqueStringArray = (value: unknown): string[] | null => {
  if (!Array.isArray(value)) {
    return null
  }

  return [...new Set(value.filter((item): item is string => typeof item === 'string' && item.length > 0))]
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

export const parseCreateAccountTypePayload = (body: CreateAccountTypeRequest): CreateAccountTypeRequest => {
  const code = normalizeOptionalText(body.code)?.toLowerCase()
  const name = normalizeOptionalText(body.name)
  const description = body.description === undefined
    ? null
    : typeof body.description === 'string'
      ? normalizeOptionalText(body.description)
      : null
  const permissionIds = normalizeUniqueStringArray(body.permissionIds) ?? []

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Account type code is required.' })
  }

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Account type name is required.' })
  }

  return {
    code,
    name,
    description,
    isSystem: body.isSystem === true,
    permissionIds,
  }
}

export const parseCreateUserProfilePayload = (body: CreateUserProfileRequest): CreateUserProfilePayload => {
  const personnelId = typeof body.personnelId === 'string'
    ? normalizeOptionalText(body.personnelId)
    : null
  const email = normalizeOptionalText(body.email)?.toLowerCase()
  const fullName = normalizeOptionalText(body.fullName)
  const avatarUrl = body.avatarUrl === undefined
    ? null
    : typeof body.avatarUrl === 'string'
      ? normalizeOptionalText(body.avatarUrl)
      : null
  const password = typeof body.password === 'string' ? body.password.trim() : ''
  const accountTypeIds = normalizeAccountTypeIds(body.accountTypeIds) ?? []

  if (!email || !isValidEmail(email)) {
    throw createError({ statusCode: 400, statusMessage: 'A valid email is required.' })
  }

  if (!fullName) {
    throw createError({ statusCode: 400, statusMessage: 'Full name is required.' })
  }

  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    throw createError({ statusCode: 400, statusMessage: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` })
  }

  return {
    personnelId,
    email,
    fullName,
    avatarUrl,
    password,
    accountTypeIds,
  }
}
