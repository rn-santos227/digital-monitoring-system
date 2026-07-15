import type { Ref } from 'vue'
import type { ReportChartsResponse } from '~/types/domain/reports'
import { extractApiErrorMessage } from '~/utils/api-request'
import { getReportChartsEndpoint } from '~/utils/report-endpoints'