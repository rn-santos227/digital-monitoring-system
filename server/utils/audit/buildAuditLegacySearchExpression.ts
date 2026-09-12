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
}
