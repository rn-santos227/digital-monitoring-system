import type {
  EquipmentCategoryListItem,
  EquipmentCategoryRow,
  EquipmentCategorySuggestionItem,
  EquipmentCategorySuggestionRow,
  EquipmentItemListItem,
  EquipmentItemRow,
  EquipmentItemSuggestionItem,
  EquipmentItemSuggestionRow,
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
