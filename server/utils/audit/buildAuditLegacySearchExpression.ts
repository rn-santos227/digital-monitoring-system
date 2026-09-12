import { createError } from 'h3'
import {
  AUDIT_LOG_LEGACY_SEARCH_FIELDS,
  AUDIT_LOG_SEARCHABLE_FIELD_COLUMNS,
} from '../../shared/constants'

type AuditLogLegacySearchField = typeof AUDIT_LOG_LEGACY_SEARCH_FIELDS[number]

export const buildAuditLegacySearchExpressions = (term: string, fields?: string): string[] => {
  if (!term) {
    return []
  }

  const rawFields = fields?.split(',').map(field => field.trim()) ?? []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is AuditLogLegacySearchField => (
        AUDIT_LOG_LEGACY_SEARCH_FIELDS.some(searchField => searchField === field)
      ))
    : [...AUDIT_LOG_LEGACY_SEARCH_FIELDS]

  const expressions = selectedFields.flatMap((field) => {
    if (field === 'statusCode') {
      const statusCode = Number(term)
      return Number.isInteger(statusCode) ? [`status_code.eq.${statusCode}`] : []
    }


  })

 return expressions
}
