import { defineEventHandler, getQuery } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { ReportChartsResponse } from '../../shared/responses'
import { parseReportDateRangeQuery } from '../../shared/validations'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchReportCharts } from '../../utils/reports/fetchReportCharts'

export default defineEventHandler(async (event): Promise<ReportChartsResponse> => {
  await requirePermission(event, PERMISSION_CODES.personnelView)
  await requirePermission(event, PERMISSION_CODES.equipmentView)

  const supabase = getServiceSupabaseClient()
  return await fetchReportCharts(supabase)
})
