import { createError } from 'h3'
import type { RecordPrintedTableAuditRequest } from '../../requests'

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
