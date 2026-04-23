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
