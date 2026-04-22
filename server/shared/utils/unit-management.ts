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

