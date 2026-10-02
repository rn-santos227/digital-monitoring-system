import { createError } from 'h3'
import type { ReportDateRangeQuery } from '../../requests'
import { ISO_DATE_PATTERN } from '../../utils/regex'

const parseReportDate = (value: unknown, label: string): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }


}
