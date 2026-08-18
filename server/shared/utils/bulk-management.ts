import { createError } from 'h3'
import type { BulkDomainDefinition, BulkMutationItem } from '../models'
import {
  BULK_UPDATE_PROTECTED_COLUMNS,
  MAX_BULK_MUTATION_ITEMS,
  PERMISSION_CODES,
} from '../constants'

const timestamps = ['created_at', 'updated_at'] as const
const mutable = (domain: string, ...columns: string[]) => {
  const protectedColumns = new Set(
    BULK_UPDATE_PROTECTED_COLUMNS[domain] ?? [],
  )

  return columns.filter(
    (column) =>
      !timestamps.includes(column as (typeof timestamps)[number]) &&
      !protectedColumns.has(column),
  )
}

export const BULK_DOMAIN_DEFINITIONS: Readonly<
  Record<string, BulkDomainDefinition>
> = {
  'account-types': {
    table: 'account_types',
    updatePermissions: [PERMISSION_CODES.accountTypeUpdate],
    deletePermissions: [PERMISSION_CODES.accountTypeDelete],
    writableColumns: mutable(
      'account-types',
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
    deletePermissions: [PERMISSION_CODES.userDelete],
    writableColumns: mutable(
      'users',
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
      'battalions',
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
      'personnel',
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
      'personnel',
      'rank_id',
      'company_id',
      'battalion_id',
      'employment_status_id',
      'service_status_id',
      'position',
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
    writableColumns: mutable(
      'training-categories',
      'code',
      'name',
      'description',
      'is_active',
    ),
    deleteReferences: [
      { table: 'training_records', column: 'training_category_id' },
    ],
  },
  trainings: {
    table: 'trainings',
    updatePermissions: [PERMISSION_CODES.trainingUpdate],
    deletePermissions: [PERMISSION_CODES.trainingDelete],
    writableColumns: mutable(
      'trainings',
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
      'training-records',
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
      'deployments',
      'deployment_area',
      'deployment_area_latitude',
      'deployment_area_longitude',
      'assignment_role',
      'operation_name',
      'location',
      'start_date',
      'end_date',
      'status_id',
      'supervisor_id',
      'default_remarks',
      'default_remarks',
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
      'deployment-records',
      'personnel_id',
      'deployment_id',
      'deployment_area',
      'deployment_area_latitude',
      'deployment_area_longitude',
      'assignment_role',
      'operation_name',
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
  engagements: {
    table: 'engagements',
    updatePermissions: [PERMISSION_CODES.engagementUpdate],
    deletePermissions: [PERMISSION_CODES.engagementDelete],
    writableColumns: mutable(
      'equipment-items',
      'title',
      'description',
      'engagement_type_id',
      'location',
      'start_date',
      'end_date',
      'status_id',
    ),
    deleteReferences: [
      { table: 'engagement_records', column: 'engagement_id' },
    ],
  },
  'engagement-records': {
    table: 'engagement_records',
    updatePermissions: [PERMISSION_CODES.engagementManage],
    deletePermissions: [PERMISSION_CODES.engagementManage],
    writableColumns: mutable(
      'equipment-assets',
      'personnel_id',
      'engagement_id',
      'engagement_type_id',
      'level_id',
      'status_id',
      'start_date',
      'end_date',
      'role',
      'remarks',
    ),
    deleteReferences: [],
  },
  'equipment-categories': {
    table: 'equipment_categories',
    updatePermissions: [PERMISSION_CODES.equipmentUpdate],
    deletePermissions: [PERMISSION_CODES.equipmentDelete],
    writableColumns: mutable(
      'equipment-categories',
      'code',
      'name',
      'requires_serial',
      'is_consumable',
      'is_controlled',
      'is_active',
    ),
    deleteReferences: [{ table: 'equipment_items', column: 'category_id' }],
  },
  'equipment-items': {
    table: 'equipment_items',
    updatePermissions: [PERMISSION_CODES.equipmentUpdate],
    deletePermissions: [PERMISSION_CODES.equipmentDelete],
    writableColumns: mutable(
      'equipment-items',
      'equipment_code',
      'category_id',
      'name',
      'model',
      'manufacturer',
      'description',
      'unit_of_measure',
      'minimum_stock_level',
      'is_serialized',
      'is_active',
    ),
    deleteReferences: [
      { table: 'equipment_assets', column: 'equipment_item_id' },
    ],
  },
  'equipment-assets': {
    table: 'equipment_assets',
    updatePermissions: [PERMISSION_CODES.equipmentUpdate],
    deletePermissions: [PERMISSION_CODES.equipmentDelete],
    writableColumns: mutable(
      'equipment-assets',
      'asset_tag',
      'equipment_item_id',
      'serial_no',
      'batch_no',
      'procurement_date',
      'acquisition_cost',
      'fund_source',
      'current_location',
      'condition_status_id',
      'serviceability_status_id',
      'asset_status_id',
      'remarks',
    ),
    deleteReferences: [
      { table: 'equipment_issuances', column: 'equipment_asset_id' },
      { table: 'equipment_maintenance_records', column: 'equipment_asset_id' },
      { table: 'equipment_incidents', column: 'equipment_asset_id' },
      { table: 'personnel_weapon_assignments', column: 'equipment_asset_id' },
    ],
  },
  'equipment-issuances': {
    table: 'equipment_issuances',
    updatePermissions: [
      PERMISSION_CODES.equipmentIssue,
      PERMISSION_CODES.equipmentManage,
    ],
    deletePermissions: [
      PERMISSION_CODES.equipmentDelete,
      PERMISSION_CODES.equipmentManage,
    ],
    writableColumns: mutable(
      'equipment-issuances',
      'equipment_asset_id',
      'issued_to_personnel_id',
      'issued_by_personnel_id',
      'deployment_id',
      'issue_date',
      'expected_return_date',
      'actual_return_date',
      'quantity_issued',
      'status_id',
      'issued_location',
      'return_location',
      'remarks',
    ),
    deleteReferences: [],
  },
  incidents: {
    table: 'equipment_incidents',
    updatePermissions: [
      PERMISSION_CODES.equipmentMaintain,
      PERMISSION_CODES.equipmentManage,
    ],
    deletePermissions: [
      PERMISSION_CODES.equipmentDelete,
      PERMISSION_CODES.equipmentManage,
    ],
    writableColumns: mutable(
      'incidents',
      'equipment_asset_id',
      'personnel_id',
      'deployment_id',
      'incident_type_id',
      'incident_date',
      'location',
      'location_latitude',
      'location_longitude',
      'description',
      'investigation_status_id',
      'resolution',
      'resolved_at',
      'remarks',
    ),
    deleteReferences: [],
  },
  ranks: {
    table: 'ranks',
    updatePermissions: [PERMISSION_CODES.rankCreate],
    writableColumns: ['sort_order'],
    deleteReferences: [{ table: 'personnel', column: 'rank_id' }],
  },
}

export const getBulkDomainDefinition = (
  domain: string,
): BulkDomainDefinition | undefined => BULK_DOMAIN_DEFINITIONS[domain]

export const parseBulkIds = (values: unknown): string[] => {
  if (
    !Array.isArray(values) ||
    values.length === 0 ||
    values.length > MAX_BULK_MUTATION_ITEMS
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: `Provide between 1 and ${MAX_BULK_MUTATION_ITEMS} records.`,
    })
  }

  const ids = values.map((value) =>
    typeof value === 'string' ? value.trim() : '',
  )
  if (ids.some((id) => !id) || new Set(ids).size !== ids.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Record ids must be non-empty and unique.',
    })
  }

  return ids
}

export const parseBulkUpdateItems = (
  values: unknown,
  writableColumns: readonly string[],
): Array<{ id: string; updates: Record<string, unknown> }> => {
  if (!Array.isArray(values)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'items must be an array.',
    })
  }

  const items = values as BulkMutationItem[]
  const ids = parseBulkIds(items.map((item) => item?.id))
  const allowed = new Set(writableColumns)

  return items.map((item, index) => {
    const updates = item.updates
    if (
      !updates ||
      Array.isArray(updates) ||
      Object.keys(updates).length === 0
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: `Updates are required for record ${ids[index] ?? ''}.`,
      })
    }

    const forbidden = Object.keys(updates).filter(
      (column) => !allowed.has(column),
    )
    if (forbidden.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Unsupported update fields: ${forbidden.join(', ')}.`,
      })
    }

    return { id: ids[index] ?? '', updates: { ...updates } }
  })
}
