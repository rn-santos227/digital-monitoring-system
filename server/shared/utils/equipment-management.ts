import { createError } from 'h3'
import type {
  EquipmentAssetListItem,
  EquipmentAssetRow,
  EquipmentAssetSuggestionItem,
  EquipmentAssetSuggestionRow,
  EquipmentIssuanceListItem,
  EquipmentIssuanceRow,
  EquipmentCategoryListItem,
  EquipmentCategoryRow,
  EquipmentCategorySuggestionItem,
  EquipmentCategorySuggestionRow,
  EquipmentItemListItem,
  EquipmentItemBattalionUsageListItem,
  EquipmentItemCompanyUsageListItem,
  EquipmentItemPersonnelUsageListItem,
  EquipmentItemPersonnelUsageRow,
  EquipmentItemRow,
  EquipmentItemSuggestionItem,
  EquipmentItemSuggestionRow,
} from '../models'
import { parseNumber } from './parsers'
import { UUID_PATTERN } from './regex'

interface EquipmentLookupSupabaseClient {
  from: (table: 'asset_statuses' | 'condition_statuses' | 'serviceability_statuses' | 'issuance_statuses') => {
    select: (columns: 'id') => {
      eq: (column: 'id' | 'name', value: string) => {
        maybeSingle: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
      }
    }
  }
}

const resolveEquipmentLookupId = async (
  supabase: unknown,
  table: 'asset_statuses' | 'condition_statuses' | 'serviceability_statuses' | 'issuance_statuses',
  value: string,
  invalidMessage: string,
): Promise<string> => {
  const supabaseClient = supabase as EquipmentLookupSupabaseClient
  const normalizedValue = value.trim()
  const filterField: 'id' | 'name' = UUID_PATTERN.test(normalizedValue) ? 'id' : 'name'

  const { data, error } = await supabaseClient
    .from(table)
    .select('id')
    .eq(filterField, normalizedValue)
    .maybeSingle()

  if (error || !data?.id) {
    throw createError({ statusCode: 400, statusMessage: invalidMessage })
  }

  return data.id
}

export const mapEquipmentCategoryListItem = (row: EquipmentCategoryRow): EquipmentCategoryListItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
  requiresSerial: row.requires_serial,
  isConsumable: row.is_consumable,
  isControlled: row.is_controlled,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapEquipmentCategorySuggestionItem = (row: EquipmentCategorySuggestionRow): EquipmentCategorySuggestionItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
  isActive: row.is_active,
})

export const parseEquipmentCategorySuggestionQuery = (query: {
  term?: unknown
  pageSize?: unknown
  selectedId?: unknown
}) => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const selectedId = typeof query.selectedId === 'string' && query.selectedId.length > 0
    ? query.selectedId
    : null
  const rawPageSize = Math.trunc(parseNumber(query.pageSize, 10))
  const pageSize = Math.min(Math.max(rawPageSize, 1), 20)

  return {
    term,
    pageSize,
    selectedId,
  }
}


export const mapEquipmentItemListItem = (row: EquipmentItemRow): EquipmentItemListItem => {
  const categoryValue = Array.isArray(row.category)
    ? (row.category[0] ?? null)
    : row.category

  return {
    id: row.id,
    equipmentCode: row.equipment_code,
    categoryId: row.category_id,
    categoryCode: categoryValue?.code ?? '',
    categoryName: categoryValue?.name ?? '',
    name: row.name,
    model: row.model,
    manufacturer: row.manufacturer,
    description: row.description,
    unitOfMeasure: row.unit_of_measure,
    minimumStockLevel: row.minimum_stock_level,
    isSerialized: row.is_serialized,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const mapEquipmentItemSuggestionItem = (row: EquipmentItemSuggestionRow): EquipmentItemSuggestionItem => ({
  id: row.id,
  equipmentCode: row.equipment_code,
  name: row.name,
  categoryName: Array.isArray(row.category)
    ? (row.category[0]?.name ?? '')
    : (row.category?.name ?? ''),
  isActive: row.is_active,
})

const firstEquipmentUsageValue = <TValue>(value: TValue | TValue[] | null): TValue | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

const toEquipmentUsageFullName = (personnel: { first_name: string; middle_name: string | null; last_name: string } | null): string => {
  if (!personnel) {
    return 'Unknown Personnel'
  }

  return [personnel.first_name, personnel.middle_name, personnel.last_name]
    .filter(Boolean)
    .join(' ')
}

export const mapEquipmentItemPersonnelUsageListItem = (row: EquipmentItemPersonnelUsageRow): EquipmentItemPersonnelUsageListItem => {
  const personnel = firstEquipmentUsageValue(row.issued_to_personnel)
  const rank = firstEquipmentUsageValue(personnel?.rank ?? null)
  const company = firstEquipmentUsageValue(personnel?.company ?? null)
  const companyBattalion = firstEquipmentUsageValue(company?.battalion ?? null)
  const battalion = firstEquipmentUsageValue(personnel?.battalion ?? null) ?? companyBattalion
  const serviceStatus = firstEquipmentUsageValue(personnel?.service_status ?? null)
  const issuanceStatus = firstEquipmentUsageValue(row.issuance_status)

  return {
    id: row.id,
    issueNo: row.issue_no,
    personnelId: personnel?.id ?? '',
    personnelCode: personnel?.personnel_code ?? 'N/A',
    serviceNumber: personnel?.service_number ?? 'N/A',
    fullName: toEquipmentUsageFullName(personnel),
    rankName: rank?.name ?? 'N/A',
    companyName: company?.name ?? null,
    battalionName: battalion?.name ?? null,
    serviceStatus: serviceStatus?.name ?? 'N/A',
    issueDate: row.issue_date,
    expectedReturnDate: row.expected_return_date,
    actualReturnDate: row.actual_return_date,
    issuanceStatus: issuanceStatus?.name ?? 'N/A',
  }
}

export const mapEquipmentItemCompanyUsageListItems = (
  rows: EquipmentItemPersonnelUsageRow[],
): EquipmentItemCompanyUsageListItem[] => {
  const companyMap = new Map<string, EquipmentItemCompanyUsageListItem & { personnelIds: Set<string> }>()

  rows.forEach((row) => {
    const personnel = firstEquipmentUsageValue(row.issued_to_personnel)
    const company = firstEquipmentUsageValue(personnel?.company ?? null)

    if (!company) {
      return
    }

    const battalion = firstEquipmentUsageValue(personnel?.battalion ?? null) ?? firstEquipmentUsageValue(company.battalion)
    const existing = companyMap.get(company.id) ?? {
      id: company.id,
      code: company.code,
      name: company.name,
      battalionName: battalion?.name ?? null,
      personnelCount: 0,
      issuanceCount: 0,
      latestIssueDate: null,
      personnelIds: new Set<string>(),
    }

    if (personnel?.id) {
      existing.personnelIds.add(personnel.id)
    }

    existing.issuanceCount += 1
    existing.latestIssueDate = !existing.latestIssueDate || row.issue_date > existing.latestIssueDate
      ? row.issue_date
      : existing.latestIssueDate
    existing.personnelCount = existing.personnelIds.size
    companyMap.set(company.id, existing)
  })

  return Array.from(companyMap.values())
    .map(({ personnelIds: _personnelIds, ...item }) => item)
    .sort((left, right) => left.name.localeCompare(right.name))
}

export const mapEquipmentItemBattalionUsageListItems = (
  rows: EquipmentItemPersonnelUsageRow[],
): EquipmentItemBattalionUsageListItem[] => {
  const battalionMap = new Map<string, EquipmentItemBattalionUsageListItem & { personnelIds: Set<string> }>()

  rows.forEach((row) => {
    const personnel = firstEquipmentUsageValue(row.issued_to_personnel)
    const company = firstEquipmentUsageValue(personnel?.company ?? null)
    const battalion = firstEquipmentUsageValue(personnel?.battalion ?? null) ?? firstEquipmentUsageValue(company?.battalion ?? null)

    if (!battalion) {
      return
    }

    const existing = battalionMap.get(battalion.id) ?? {
      id: battalion.id,
      code: battalion.code,
      name: battalion.name,
      personnelCount: 0,
      issuanceCount: 0,
      latestIssueDate: null,
      personnelIds: new Set<string>(),
    }

    if (personnel?.id) {
      existing.personnelIds.add(personnel.id)
    }

    existing.issuanceCount += 1
    existing.latestIssueDate = !existing.latestIssueDate || row.issue_date > existing.latestIssueDate
      ? row.issue_date
      : existing.latestIssueDate
    existing.personnelCount = existing.personnelIds.size
    battalionMap.set(battalion.id, existing)
  })

  return Array.from(battalionMap.values())
    .map(({ personnelIds: _personnelIds, ...item }) => item)
    .sort((left, right) => left.name.localeCompare(right.name))
}

export const parseEquipmentItemSuggestionQuery = (query: {
  term?: unknown
  pageSize?: unknown
  selectedId?: unknown
}) => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const selectedId = typeof query.selectedId === 'string' && query.selectedId.length > 0
    ? query.selectedId
    : null
  const rawPageSize = Math.trunc(parseNumber(query.pageSize, 10))
  const pageSize = Math.min(Math.max(rawPageSize, 1), 20)

  return {
    term,
    pageSize,
    selectedId,
  }
}

export const resolveEquipmentAssetStatusId = async (supabase: unknown, value: string): Promise<string> => {
  return await resolveEquipmentLookupId(
    supabase,
    'asset_statuses',
    value,
    'Invalid asset status value.',
  )
}

export const resolveEquipmentConditionStatusId = async (supabase: unknown, value: string): Promise<string> => {
  return await resolveEquipmentLookupId(
    supabase,
    'condition_statuses',
    value,
    'Invalid condition status value.',
  )
}

export const resolveEquipmentServiceabilityStatusId = async (supabase: unknown, value: string): Promise<string> => {
  return await resolveEquipmentLookupId(
    supabase,
    'serviceability_statuses',
    value,
    'Invalid serviceability status value.',
  )
}

export const resolveEquipmentIssuanceStatusId = async (supabase: unknown, value: string): Promise<string> => {
  return await resolveEquipmentLookupId(
    supabase,
    'issuance_statuses',
    value,
    'Invalid issuance status value.',
  )
}

export const mapEquipmentAssetListItem = (row: EquipmentAssetRow): EquipmentAssetListItem => {
  const equipmentItem = Array.isArray(row.equipment_item) ? (row.equipment_item[0] ?? null) : row.equipment_item
  const conditionStatus = Array.isArray(row.condition_status) ? (row.condition_status[0] ?? null) : row.condition_status
  const serviceabilityStatus = Array.isArray(row.serviceability_status) ? (row.serviceability_status[0] ?? null) : row.serviceability_status
  const assetStatus = Array.isArray(row.asset_status) ? (row.asset_status[0] ?? null) : row.asset_status

  return {
    id: row.id,
    assetTag: row.asset_tag,
    equipmentItemId: row.equipment_item_id,
    equipmentItemCode: equipmentItem?.equipment_code ?? '',
    equipmentItemName: equipmentItem?.name ?? '',
    serialNo: row.serial_no,
    batchNo: row.batch_no,
    procurementDate: row.procurement_date,
    acquisitionCost: row.acquisition_cost,
    fundSource: row.fund_source,
    currentLocation: row.current_location,
    conditionStatusId: row.condition_status_id,
    conditionStatusName: conditionStatus?.name ?? null,
    serviceabilityStatusId: row.serviceability_status_id,
    serviceabilityStatusName: serviceabilityStatus?.name ?? null,
    assetStatusId: row.asset_status_id,
    assetStatusName: assetStatus?.name ?? '',
    remarks: row.remarks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const mapEquipmentAssetSuggestionItem = (row: EquipmentAssetSuggestionRow): EquipmentAssetSuggestionItem => {
  const equipmentItem = Array.isArray(row.equipment_item)
    ? (row.equipment_item[0] ?? null)
    : row.equipment_item
  const category = Array.isArray(equipmentItem?.category)
    ? (equipmentItem.category[0] ?? null)
    : (equipmentItem?.category ?? null)

  return {
    id: row.id,
    assetTag: row.asset_tag,
    equipmentItemName: equipmentItem?.name ?? '',
    categoryName: category?.name ?? '',
  }
}

const mapPersonnelDisplayName = (personnel: { personnel_code: string; first_name: string; middle_name: string | null; last_name: string } | null) => {
  if (!personnel) {
    return ''
  }

  const middleName = personnel.middle_name ? ` ${personnel.middle_name}` : ''

  return `${personnel.last_name}, ${personnel.first_name}${middleName} (${personnel.personnel_code})`
}

const normalizeSingleRelation = <T>(value: T | T[] | null): T | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

export const mapEquipmentIssuanceListItem = (
  row: Pick<
    EquipmentIssuanceRow,
    | 'id'
    | 'issue_no'
    | 'equipment_asset_id'
    | 'issued_to_personnel_id'
    | 'issued_by_personnel_id'
    | 'deployment_id'
    | 'status_id'
    | 'created_at'
    | 'equipment_asset'
    | 'issued_to_personnel'
    | 'issued_by_personnel'
    | 'deployment'
    | 'issuance_status'
  > & Partial<
    Pick<
      EquipmentIssuanceRow,
      | 'issue_date'
      | 'expected_return_date'
      | 'actual_return_date'
      | 'quantity_issued'
      | 'issued_location'
      | 'return_location'
      | 'remarks'
      | 'updated_at'
    >
  >,
): EquipmentIssuanceListItem => {
  const equipmentAssetValue = normalizeSingleRelation(row.equipment_asset)
  const equipmentItemValue = normalizeSingleRelation(equipmentAssetValue?.equipment_item ?? null)
  const issuedToPersonnelValue = normalizeSingleRelation(row.issued_to_personnel)
  const issuedByPersonnelValue = normalizeSingleRelation(row.issued_by_personnel)
  const deploymentValue = normalizeSingleRelation(row.deployment)
  const issuanceStatusValue = normalizeSingleRelation(row.issuance_status)

  return {
    id: row.id,
    issueNo: row.issue_no,
    equipmentAssetId: row.equipment_asset_id,
    equipmentAssetTag: equipmentAssetValue?.asset_tag ?? '',
    equipmentItemName: equipmentItemValue?.name ?? '',
    issuedToPersonnelId: row.issued_to_personnel_id,
    issuedToPersonnelName: mapPersonnelDisplayName(issuedToPersonnelValue),
    issuedByPersonnelId: row.issued_by_personnel_id,
    issuedByPersonnelName: mapPersonnelDisplayName(issuedByPersonnelValue),
    deploymentId: row.deployment_id,
    deploymentLabel: deploymentValue ? `${deploymentValue.operation_name} (${deploymentValue.deployment_area})` : null,
    issueDate: row.issue_date ?? '',
    expectedReturnDate: row.expected_return_date ?? null,
    actualReturnDate: row.actual_return_date ?? null,
    quantityIssued: row.quantity_issued ?? 0,
    statusId: row.status_id,
    statusName: issuanceStatusValue?.name ?? '',
    issuedLocation: row.issued_location ?? null,
    returnLocation: row.return_location ?? null,
    remarks: row.remarks ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? row.created_at,
  }
}
