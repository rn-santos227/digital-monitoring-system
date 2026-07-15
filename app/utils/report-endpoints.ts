import { API_LOADING_MESSAGES, REPORTS_API_ENDPOINTS } from '~/constants/api.constants'
import type { ReportChartsResponse } from '~/types/domain/reports'
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