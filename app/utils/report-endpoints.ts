import { API_LOADING_MESSAGES, REPORTS_API_ENDPOINTS } from '~/constants/api.constants'
import type { ReportChartsResponse, ReportDateRange } from '~/types/domain/reports'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'


const getReportSessionHeaders = (): Record<string, string> => {
  if (!import.meta.server) {
    return createSessionHeaders()
  }

  const requestHeaders = useRequestHeaders(['cookie'])
  const cookie = requestHeaders.cookie?.trim() ?? ''

  if (!cookie) {
    return createSessionHeaders()
  }

  return {
    cookie,
    ...createSessionHeaders(),
  }
}

export const getReportChartsEndpoint = async (dateRange?: ReportDateRange): Promise<ReportChartsResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<ReportChartsResponse>(REPORTS_API_ENDPOINTS.reports, {
      method: 'GET',
      headers: getReportSessionHeaders(),
      query: dateRange,
    })
  }, API_LOADING_MESSAGES.fetchReportCharts)
}
