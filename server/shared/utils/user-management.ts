import type { AccountTypeListItem, PrivilegeListItem, UserProfileListItem } from '../models'
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
  account_type_permissions: AccountTypePermissionRow[] | null
}

interface UserAccountTypeRow {
  account_types: {
    id: string
    code: string
    name: string
  } | null
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
    accountTypes: (row.user_account_types ?? [])
      .map(accountTypeRow => accountTypeRow.account_types)
      .filter((accountType): accountType is NonNullable<typeof accountType> => Boolean(accountType)),
  }
}

export const normalizeOptionalText = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()

  return normalized.length > 0 ? normalized : null
}
