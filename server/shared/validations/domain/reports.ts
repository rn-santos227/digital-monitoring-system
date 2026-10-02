import { createError } from 'h3'
import type { ReportDateRangeQuery } from '../../requests'
import { ISO_DATE_PATTERN } from '../../utils/regex'

const parseReportDate = (value: unknown, label: string): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) {
    throw createError({ statusCode: 400, statusMessage: `${label} must use YYYY-MM-DD format.` })
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== value) {
    throw createError({ statusCode: 400, statusMessage: `${label} must be a valid date.` })
  }

  return value
}

export const parseReportDateRangeQuery = (query: Record<string, unknown>): ReportDateRangeQuery => {
  const dateFrom = parseReportDate(query.dateFrom, 'Start date')

}
