import { API_LOADING_MESSAGES, REPORTS_API_ENDPOINTS } from '~/constants/api.constants'
import type { ReportChartsResponse } from '~/types/domain/reports'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

const getReportSessionHeaders = (): Record<string, string> => {

}