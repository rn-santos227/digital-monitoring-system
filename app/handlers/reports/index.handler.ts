import type { Ref } from 'vue'
import type { ReportChartsResponse } from '~/types/domain/reports'
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
}

export const loadReportCharts = async ({
  reportChartsResponse,
  reportLoadError,
}: LoadReportChartsOptions): Promise<void> => {


}
