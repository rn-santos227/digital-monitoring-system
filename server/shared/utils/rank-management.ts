import type { RankListItem, RankRow, RankSuggestionItem, RankSuggestionRow } from '../models'
import { parseNumber } from './parsers'

export const mapRankListItem = (row: RankRow): RankListItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapRankSuggestionItem = (row: RankSuggestionRow): RankSuggestionItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
  sortOrder: row.sort_order,
})

export const parseRankSuggestionQuery = (query: {
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
