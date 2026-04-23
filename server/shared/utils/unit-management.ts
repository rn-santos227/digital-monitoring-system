import { createError } from 'h3'
import { parseNumber } from './parsers'
import type {
  BattalionListItem,
  BattalionReferenceRow,
  BattalionRow,
  BattalionSuggestionItem,
  CompanyListItem,
  CompanyRow,
  CompanySuggestionItem,
  UnitEquipmentAssetListItem,
  UnitEquipmentAssetRow,
  UnitPersonnelListItem,
  UnitPersonnelProfileRow,
} from '../models'

const toBattalionReference = (value: BattalionReferenceRow | BattalionReferenceRow[] | null): BattalionReferenceRow | null => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

export const parseUnitSuggestionQuery = (query: {
  term?: unknown
  pageSize?: unknown
  selectedId?: unknown
  battalionId?: unknown
}) => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const selectedId = typeof query.selectedId === 'string' && query.selectedId.length > 0 ? query.selectedId : null
  const battalionId = typeof query.battalionId === 'string' && query.battalionId.length > 0 ? query.battalionId : null
  const rawPageSize = Math.trunc(parseNumber(query.pageSize, 10))
  const pageSize = Math.min(Math.max(rawPageSize, 1), 20)

  return {
    term,
    pageSize,
    selectedId,
    battalionId,
  }
}

export const mapBattalionListItem = (row: BattalionRow): BattalionListItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapCompanyListItem = (row: CompanyRow): CompanyListItem => {
  const battalion = toBattalionReference(row.battalion)

  return {
    id: row.id,
    battalionId: row.battalion_id,
    battalionCode: battalion?.code ?? null,
    battalionName: battalion?.name ?? null,
    code: row.code,
    name: row.name,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const mapBattalionSuggestionItem = (row: Pick<BattalionRow, 'id' | 'code' | 'name' | 'is_active'>): BattalionSuggestionItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
  isActive: row.is_active,
})

export const mapCompanySuggestionItem = (
  row: Pick<CompanyRow, 'id' | 'battalion_id' | 'battalion' | 'code' | 'name' | 'is_active'>,
): CompanySuggestionItem => {
  const battalion = toBattalionReference(row.battalion)

  return {
    id: row.id,
    battalionId: row.battalion_id,
    battalionCode: battalion?.code ?? null,
    battalionName: battalion?.name ?? null,
    code: row.code,
    name: row.name,
    isActive: row.is_active,
  }
}

export const mapUnitPersonnelListItem = (row: UnitPersonnelProfileRow): UnitPersonnelListItem => {
  return {
    id: row.id,
    personnelCode: row.personnel_code,
    serviceNumber: row.service_number,
    fullName: row.full_name,
    rankName: row.rank_name,
    companyName: row.company_name,
    battalionName: row.battalion_name,
    serviceStatus: row.service_status,
  }
}

const toPersonnelFullName = (row: UnitEquipmentAssetRow): string | null => {
  const firstName = row.assigned_personnel_first_name?.trim() ?? ''
  const lastName = row.assigned_personnel_last_name?.trim() ?? ''
  const fullName = `${firstName} ${lastName}`.trim()

  return fullName.length > 0 ? fullName : null
}

export const mapUnitEquipmentAssetListItem = (row: UnitEquipmentAssetRow): UnitEquipmentAssetListItem => {
  return {
    id: row.equipment_asset_id,
    assetTag: row.asset_tag,
    serialNo: row.serial_no,
    equipmentCode: row.equipment_code,
    itemName: row.item_name,
    categoryCode: row.category_code,
    categoryName: row.category_name,
    assignedPersonnelCode: row.assigned_personnel_code,
    assignedPersonnelName: toPersonnelFullName(row),
    assignedCompanyCode: row.assigned_company_code,
    assignedCompanyName: row.assigned_company_name,
    assignedBattalionCode: row.assigned_battalion_code,
    assignedBattalionName: row.assigned_battalion_name,
    currentLocation: row.current_location,
    conditionStatus: row.condition_status,
    serviceabilityStatus: row.serviceability_status,
    assetStatus: row.asset_status,
    latestIssueNo: row.latest_issue_no,
    latestIssueDate: row.latest_issue_date,
    latestIssuanceStatus: row.latest_issuance_status,
  }
}

export const assertBattalionExists = async (args: {
  supabase: unknown
  battalionId: string
  idSelectColumns: string
}) => {
  const supabaseClient = args.supabase as {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          maybeSingle: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
        }
      }
    }
  }

  const { data, error } = await supabaseClient
    .from('battalions')
    .select(args.idSelectColumns)
    .eq('id', args.battalionId)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to validate battalion reference: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Battalion not found.' })
  }
}

export const assertCompanyExists = async (args: {
  supabase: unknown
  companyId: string
  idSelectColumns: string
}) => {
  const supabaseClient = args.supabase as {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          maybeSingle: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
        }
      }
    }
  }

  const { data, error } = await supabaseClient
    .from('companies')
    .select(args.idSelectColumns)
    .eq('id', args.companyId)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to validate company reference: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found.' })
  }
}
