import type {
  EquipmentCategoryListItem,
  EquipmentCategoryRow,
  EquipmentCategorySuggestionItem,
  EquipmentCategorySuggestionRow,
} from '../models'
import { parseNumber } from './parsers'

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
