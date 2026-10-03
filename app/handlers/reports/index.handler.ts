import type { Ref } from 'vue'
import type { ReportChartsResponse, ReportDateRange } from '~/types/domain/reports'
import { extractApiErrorMessage } from '~/utils/api-request'
import { getReportChartsEndpoint } from '~/utils/report-endpoints'

export const createEmptyReportChartsResponse = (): ReportChartsResponse => ({
  asOf: '',
  personnel: {
    metrics: {
      totalRecords: 0,
      battalionsRepresented: 0,
      companiesRepresented: 0,
    },
    charts: {
      serviceStatus: [],
      battalions: [],
      companies: [],
      sex: [],
      timeline: [],
    },
  },
  equipment: {
    metrics: {
      totalAssets: 0,
      totalItems: 0,
      trackedLocations: 0,
    },
    charts: {
      assetStatus: [],
      serviceability: [],
      items: [],
      locations: [],
      timeline: [],
    },
  },
})

interface LoadReportChartsOptions {
  reportChartsResponse: Ref<ReportChartsResponse>
  reportLoadError: Ref<string>
  dateRange?: ReportDateRange
}

interface ReportDateRangeHandlerOptions extends LoadReportChartsOptions {

}

export const loadReportCharts = async ({
  reportChartsResponse,
  reportLoadError,
  dateRange,
}: LoadReportChartsOptions): Promise<void> => {
  reportLoadError.value = ''

  try {
    reportChartsResponse.value = await getReportChartsEndpoint(dateRange)
  } catch (error) {
    reportLoadError.value = extractApiErrorMessage(error, 'Unable to load report data right now.')
  }
}
