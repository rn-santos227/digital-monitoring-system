import { createError } from 'h3'
import type { GlobalSearchSuggestionQuery, ParsedGlobalSearchSuggestionQuery } from '../../requests'

export const parseGlobalSearchSuggestionQuery = (
  query: GlobalSearchSuggestionQuery,
): ParsedGlobalSearchSuggestionQuery => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''

  if (!term) {
    throw createError({ statusCode: 400, statusMessage: 'Search term is required.' })
  }

  return { term }
}
