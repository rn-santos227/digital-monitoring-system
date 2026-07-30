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
  companies: {
    table: 'companies',
    updatePermissions: [PERMISSION_CODES.companyUpdate],
    deletePermissions: [PERMISSION_CODES.companyDelete],
    writableColumns: mutable(
      'code',
      'name',
      'battalion_id',
      'location',
      'is_active',
    ),
    deleteReferences: [
      { table: 'personnel', column: 'company_id' },
      { table: 'equipment_assets', column: 'assigned_company_id' },
    ],
  },
  personnel: {
    table: 'personnel',
    updatePermissions: [PERMISSION_CODES.personnelUpdate],
    deletePermissions: [PERMISSION_CODES.personnelDelete],
    writableColumns: mutable(
      'rank_id',
      'company_id',
      'battalion_id',
      'employment_status_id',
      'service_status_id',
      'position_title',
      'current_location',
    ),
    deleteReferences: [
      { table: 'training_records', column: 'personnel_id' },
      { table: 'deployment_records', column: 'personnel_id' },
      { table: 'deployment_records', column: 'supervisor_id' },
      { table: 'engagement_records', column: 'personnel_id' },
      { table: 'equipment_assets', column: 'assigned_personnel_id' },
      { table: 'equipment_issuances', column: 'issued_to_personnel_id' },
      { table: 'equipment_issuances', column: 'issued_by_personnel_id' },
      { table: 'personnel_qualifications', column: 'personnel_id' },
      { table: 'personnel_medical_readiness', column: 'personnel_id' },
      { table: 'personnel_weapon_assignments', column: 'personnel_id' },
      { table: 'user_profiles', column: 'personnel_id' },
    ],
  },
  'training-categories': {
    table: 'training_categories',
    updatePermissions: [PERMISSION_CODES.trainingUpdate],
    deletePermissions: [PERMISSION_CODES.trainingDelete],
    writableColumns: mutable('code', 'name', 'description', 'is_active'),
    deleteReferences: [
      { table: 'training_records', column: 'training_category_id' },
    ],
  },
  trainings: {
    table: 'trainings',
    updatePermissions: [PERMISSION_CODES.trainingUpdate],
    deletePermissions: [PERMISSION_CODES.trainingDelete],
    writableColumns: mutable(
      'training_category_id',
      'title',
      'description',
      'start_date',
      'end_date',
      'location',
      'status_id',
    ),
    deleteReferences: [{ table: 'training_records', column: 'training_id' }],
  },
  'training-records': {
    table: 'training_records',
    updatePermissions: [PERMISSION_CODES.trainingManage],
    deletePermissions: [PERMISSION_CODES.trainingManage],
    writableColumns: mutable(
      'personnel_id',
      'training_id',
      'training_category_id',
      'level_id',
      'status_id',
      'start_date',
      'end_date',
      'completion_date',
      'provider',
      'certificate_no',
      'remarks',
    ),
    deleteReferences: [],
  },
  deployments: {
    table: 'deployments',
    updatePermissions: [PERMISSION_CODES.deploymentUpdate],
    deletePermissions: [PERMISSION_CODES.deploymentDelete],
    writableColumns: mutable(
      'name',
      'description',
      'location',
      'start_date',
      'end_date',
      'status_id',
      'supervisor_id',
    ),
    deleteReferences: [
      { table: 'deployment_records', column: 'deployment_id' },
    ],
  },
  'deployment-records': {
    table: 'deployment_records',
    updatePermissions: [PERMISSION_CODES.deploymentManage],
    deletePermissions: [PERMISSION_CODES.deploymentManage],
    writableColumns: mutable(
      'personnel_id',
      'deployment_id',
      'location',
      'start_date',
      'end_date',
      'status_id',
      'supervisor_id',
      'remarks',
    ),
    deleteReferences: [
      { table: 'equipment_issuances', column: 'deployment_id' },
    ],
  },
}
