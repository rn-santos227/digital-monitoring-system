import { createError } from 'h3'
import type { AuditAdvancedSearchConditionRequest, RecordPrintedTableAuditRequest } from '../../requests'

const AUDIT_SEARCH_FIELDS = new Set(['action', 'tableName', 'recordId', 'ipAddress', 'statusCode', 'userName', 'createdAt'])
const AUDIT_SEARCH_OPERATORS = new Set(['contains', 'equals', 'notEquals', 'startsWith', 'endsWith', 'between'])

export const parseAuditAdvancedSearchConditions = (serializedConditions: string): AuditAdvancedSearchConditionRequest[] => {
  let parsed: unknown

  try {
    parsed = JSON.parse(serializedConditions)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Advanced search conditions must be valid JSON.' })
  }

  if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > 12) {
    throw createError({ statusCode: 400, statusMessage: 'Advanced search accepts between 1 and 12 conditions.' })
  }

  return parsed.map((condition) => {
    const record = condition && typeof condition === 'object' ? condition as Record<string, unknown> : {}
    const field = typeof record.field === 'string' ? record.field : ''
    const operator = typeof record.operator === 'string' ? record.operator : ''
    const value = typeof record.value === 'string' ? record.value.trim() : ''
    const valueTo = typeof record.valueTo === 'string' ? record.valueTo.trim() : undefined
  })
}

export const parseRecordPrintedTableAuditPayload = (payload: RecordPrintedTableAuditRequest): RecordPrintedTableAuditRequest => {
  const normalizedTableName = typeof payload.tableName === 'string' ? payload.tableName.trim() : ''

  if (!normalizedTableName) {
    throw createError({ statusCode: 400, statusMessage: 'tableName is required.' })
  }

  const normalizedTableLabel = typeof payload.tableLabel === 'string'
    ? payload.tableLabel.trim()
    : null

  if (typeof payload.filters !== 'undefined' && payload.filters !== null) {
    const isObject = typeof payload.filters === 'object' && !Array.isArray(payload.filters)

    if (!isObject) {
      throw createError({ statusCode: 400, statusMessage: 'filters must be an object when provided.' })
    }
  }

  return {
    tableName: normalizedTableName,
    tableLabel: normalizedTableLabel && normalizedTableLabel.length > 0 ? normalizedTableLabel : null,
    filters: payload.filters ?? null,
  }
}
