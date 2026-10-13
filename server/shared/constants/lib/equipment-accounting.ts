import type { EquipmentAccountingSubject } from '../../models'
import { PERSONNEL_PERMISSION_GROUPS } from './personnel-management'
import { UNIT_PERMISSION_GROUPS } from './unit-management'

export const EQUIPMENT_PRICE_MAX_VALUE = 999999999999.99
export const EQUIPMENT_PRICE_VALIDATION_MESSAGE =
  'Acquisition cost must be a non-negative number with at most two decimal places (maximum 999999999999.99 PHP).'

export const EQUIPMENT_ACCOUNTING_SUBJECT_CONFIG = Object.freeze({
  personnel: {
    table: 'personnel',
    column: 'personnel_id',
    permissions: PERSONNEL_PERMISSION_GROUPS.personnelManagement,
  },
  company: {
    table: 'companies',
    column: 'company_id',
    permissions: UNIT_PERMISSION_GROUPS.companyManagement,
  },
  battalion: {
    table: 'battalions',
    column: 'battalion_id',
    permissions: UNIT_PERMISSION_GROUPS.battalionManagement,
  },
} as const satisfies Record<EquipmentAccountingSubject, {
  table: string
  column: string
  permissions: readonly string[]
}>)

export const EQUIPMENT_ASSIGNMENT_VALUE_SELECT_COLUMNS =
  'equipment_asset_id,asset_tag,item_name,acquisition_cost,quantity,assigned_value,personnel_id,company_id,battalion_id'

export const EQUIPMENT_ASSIGNMENT_VALUE_SUMMARY_SELECT_COLUMNS =
  'asset_count,quantity,unpriced_asset_count,total_value'
