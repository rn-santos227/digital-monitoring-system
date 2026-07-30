import { createError } from 'h3'
import type { BulkDomainDefinition, BulkMutationItem } from '../models'
import { MAX_BULK_MUTATION_ITEMS, PERMISSION_CODES } from '../constants'

const timestamps = ['created_at', 'updated_at'] as const
const mutable = (...columns: string[]) =>
  columns.filter(
    (column) => !timestamps.includes(column as (typeof timestamps)[number]),
  )

export const BULK_DOMAIN_DEFINITIONS: Readonly<
  Record<string, BulkDomainDefinition>
> = {
  'account-types': {
    table: 'account_types',
    updatePermissions: [PERMISSION_CODES.accountTypeUpdate],
    deletePermissions: [PERMISSION_CODES.accountTypeDelete],
    writableColumns: mutable(
      'code',
      'name',
      'description',
      'is_system',
      'is_active',
    ),
    deleteReferences: [
      { table: 'user_account_types', column: 'account_type_id' },
    ],
  },
  users: {
    table: 'user_profiles',
    updatePermissions: [PERMISSION_CODES.userUpdate],
    writableColumns: mutable(
      'personnel_id',
      'email',
      'full_name',
      'avatar_url',
      'is_active',
    ),
    deleteReferences: [],
  },
  battalions: {
    table: 'battalions',
    updatePermissions: [PERMISSION_CODES.battalionUpdate],
    deletePermissions: [PERMISSION_CODES.battalionDelete],
    writableColumns: mutable(
      'code',
      'name',
      'headquarters_location',
      'is_active',
    ),
    deleteReferences: [
      { table: 'companies', column: 'battalion_id' },
      { table: 'personnel', column: 'battalion_id' },
      { table: 'equipment_assets', column: 'assigned_battalion_id' },
    ],
  },
}
