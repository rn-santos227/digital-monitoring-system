import { createError } from 'h3'
import { parseManagementPaginationQuery } from '../../utils'

export const parseEquipmentAccountingQuery = (query: Record<string, unknown>) => {
  const subject = query.subject
  if (subject !== 'personnel' && subject !== 'company' && subject !== 'battalion') {
    throw createError({ statusCode: 400, statusMessage: 'Select personnel, company, or battalion for equipment valuation.' })
  }

  const subjectId = typeof query.subjectId === 'string' ? query.subjectId.trim() : ''
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(subjectId)) {
    throw createError({ statusCode: 400, statusMessage: 'A valid equipment valuation subject id is required.' })
  }

  return {
    subject,
    subjectId,
    ...parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize }),
  }
}
