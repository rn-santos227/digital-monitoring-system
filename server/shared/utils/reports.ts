import {
  REPORT_CHART_DEFAULT_COLORS,
  REPORT_TOP_CATEGORY_LIMIT,
} from '../constants'
import type { ReportChartDataPoint } from '../responses'

export interface ReportPersonnelChartRow {
  service_status: string | null
  battalion_name: string | null
  company_name: string | null
  sex: string | null
  created_at: string | null
}

interface ReportReferenceRow {
  name?: string | null
}


