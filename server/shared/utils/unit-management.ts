import { parseNumber } from './parsers'
import type {
  BattalionListItem,
  BattalionReferenceRow,
  BattalionRow,
  BattalionSuggestionItem,
  CompanyListItem,
  CompanyRow,
  CompanySuggestionItem,
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
