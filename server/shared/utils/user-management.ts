import { createError } from 'h3'
import type { AccountTypeListItem, PrivilegeListItem, UserProfileListItem } from '../models'
import type { UserProfileDetailResponse, UserProfileListItemCompact } from '../responses'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants'
import { parseNumber } from './parsers'

interface AccountTypePermissionSummaryRow {
  id: string
  code: string
  name: string
  module: string
}

interface AccountTypePermissionRow {
  permissions: AccountTypePermissionSummaryRow | AccountTypePermissionSummaryRow[] | null
}

interface AccountTypeListRow {
  id: string
  code: string
  name: string
  description: string | null
  is_system: boolean
  created_at: string
  updated_at: string
  account_type_permissions?: AccountTypePermissionRow[] | null
}

interface UserAccountTypeSummaryRow {
  id: string
  code: string
  name: string
}

interface UserAccountTypeRow {
  account_types: UserAccountTypeSummaryRow | UserAccountTypeSummaryRow[] | null
}

interface UserAccountTypeCodeSummaryRow {
  code: string
}

interface UserAccountTypeCodeRow {
  account_types: UserAccountTypeCodeSummaryRow | UserAccountTypeCodeSummaryRow[] | null
}

interface UserProfileListRow {
  id: string
  personnel_id: string | null
  email: string
  full_name: string
  avatar_url: string | null
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
  user_account_types: UserAccountTypeRow[] | null
}

interface UserProfileCompactRow {
  id: string
  email: string
  full_name: string
  is_active: boolean
  last_login_at: string | null
  user_account_types: UserAccountTypeCodeRow[] | null
}

interface UserProfileDetailRow {
  id: string
  personnel_id: string | null
  email: string
  full_name: string
  avatar_url: string | null
  is_active: boolean
  last_login_at: string | null
  password_updated_at: string | null
  created_at: string
  updated_at: string
  user_account_types: UserAccountTypeRow[] | null
}

interface PrivilegeListRow {
  id: string
  code: string
  name: string
  module: string
}

export const mapPrivilegeListItem = (
  row: PrivilegeListRow,
  assignedPermissionIds: Set<string>,
): PrivilegeListItem => {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    module: row.module,
    isAssigned: assignedPermissionIds.has(row.id),
  }
}

export const parseManagementPaginationQuery = (query: { page?: unknown; pageSize?: unknown }) => {
  const rawPage = Math.trunc(parseNumber(query.page, DEFAULT_PAGE))
  const rawPageSize = Math.trunc(parseNumber(query.pageSize, DEFAULT_PAGE_SIZE))

  const page = Math.max(rawPage, DEFAULT_PAGE)
  const pageSize = Math.min(Math.max(rawPageSize, 1), MAX_PAGE_SIZE)
  const rangeFrom = (page - 1) * pageSize
  const rangeTo = rangeFrom + pageSize - 1

  return {
    page,
    pageSize,
    rangeFrom,
    rangeTo,
  }
}

const toAccountTypePermissions = (permissionRow: AccountTypePermissionRow): AccountTypePermissionSummaryRow[] => {
  const { permissions } = permissionRow

  if (!permissions) {
    return []
  }

  if (Array.isArray(permissions)) {
    return permissions
  }

  return [permissions]
}

export const mapAccountTypeListItem = (row: AccountTypeListRow): AccountTypeListItem => {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    isSystem: row.is_system,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    permissions: (row.account_type_permissions ?? []).flatMap(toAccountTypePermissions),
  }
}


const toUserAccountTypes = (accountTypeRow: UserAccountTypeRow): UserAccountTypeSummaryRow[] => {
  const { account_types: accountTypes } = accountTypeRow

  if (!accountTypes) {
    return []
  }

  if (Array.isArray(accountTypes)) {
    return accountTypes
  }

  return [accountTypes]
}

const toUserAccountTypeCodes = (accountTypeRow: UserAccountTypeCodeRow): UserAccountTypeCodeSummaryRow[] => {
  const { account_types: accountTypes } = accountTypeRow

  if (!accountTypes) {
    return []
  }

  if (Array.isArray(accountTypes)) {
    return accountTypes
  }

  return [accountTypes]
}

export const mapUserProfileListItem = (row: UserProfileListRow): UserProfileListItem => {
  return {
    id: row.id,
    personnelId: row.personnel_id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    isActive: row.is_active,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    accountTypes: (row.user_account_types ?? []).flatMap(toUserAccountTypes),
  }
}

export const assertPersonnelAssignable = (args: {
  selectedPersonnelId: string | null
  assignedProfileByPersonnelId: Map<string, { id: string; personnelId: string; email: string }>
  personnelId: string
  message?: string
}) => {
  const assignedProfile = args.assignedProfileByPersonnelId.get(args.personnelId)

  if (!assignedProfile) {
    return
  }

  if (args.selectedPersonnelId && assignedProfile.personnelId === args.selectedPersonnelId) {
    return
  }

  throw createError({
    statusCode: 409,
    statusMessage: args.message ?? 'Selected personnel is already assigned to another user profile.',
  })
}

export const buildAssignedPersonnelProfileMap = (profiles: Array<{ id: string; personnel_id: string | null; email: string }>) => {
  const map = new Map<string, { id: string; personnelId: string; email: string }>()

  profiles.forEach((profile) => {
    if (!profile.personnel_id) {
      return
    }

    map.set(profile.personnel_id, {
      id: profile.id,
      personnelId: profile.personnel_id,
      email: profile.email,
    })
  })

  return map
}

export const mapUserProfileCompactListItem = (row: UserProfileCompactRow): UserProfileListItemCompact => {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    isActive: row.is_active,
    lastLoginAt: row.last_login_at,
    accountTypes: (row.user_account_types ?? []).flatMap(toUserAccountTypeCodes).map(accountType => ({
      code: accountType.code,
    })),
  }
}

export const mapUserProfileDetail = (row: UserProfileDetailRow): UserProfileDetailResponse => {
  return {
    id: row.id,
    personnelId: row.personnel_id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    isActive: row.is_active,
    lastLoginAt: row.last_login_at,
    passwordUpdatedAt: row.password_updated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    accountTypes: (row.user_account_types ?? []).flatMap(toUserAccountTypes),
  }
}

export const normalizeOptionalText = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()

  return normalized.length > 0 ? normalized : null
}
