import { API_LOADING_MESSAGES, DASHBOARD_API_ENDPOINTS } from '~/constants/api.constants'
import { createSessionHeaders } from '~/utils/auth-session'
import { withApiLoading } from '~/utils/api-request'
import type { UnitManagementKpis } from '~/types/domain/units'
import type {
  DashboardCriticalEquipment,
  DashboardCriticalPersonnel,
  DashboardEquipmentStatusOverview,
  DashboardLocationLoadAnalysis,
  DashboardNearRotation,
  DashboardOperationalTimeMonitoring,
  DashboardParameters,
  DashboardPersonnelDeploymentHistory,
  DashboardPersonnelDeploymentSummary,
  DashboardTopKpis,
} from '~/types/domain/dashboard'

interface DashboardCountResponse {
  totalItems: number
}

const DASHBOARD_DEFAULT_QUERY = Object.freeze({
  page: 1,
  pageSize: 1,
})


const getDashboardSessionHeaders = (): Record<string, string> => {
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

export const getPersonnelCount = async (): Promise<number> => {
  const response = await $fetch<DashboardCountResponse>('/api/personnel', {
    method: 'GET',
    headers: getDashboardSessionHeaders(),
    query: DASHBOARD_DEFAULT_QUERY,
  })

  return response.totalItems
}

export const getBattalionCount = async (): Promise<number> => {
  const response = await $fetch<DashboardCountResponse>('/api/battalions', {
    method: 'GET',
    headers: getDashboardSessionHeaders(),
    query: DASHBOARD_DEFAULT_QUERY,
  })

  return response.totalItems
}

export const getCompanyCount = async (): Promise<number> => {
  const response = await $fetch<DashboardCountResponse>('/api/companies', {
    method: 'GET',
    headers: getDashboardSessionHeaders(),
    query: DASHBOARD_DEFAULT_QUERY,
  })

  return response.totalItems
}

export const getAccountTypeCount = async (): Promise<number> => {
  const response = await $fetch<DashboardCountResponse>('/api/account-types', {
    method: 'GET',
    headers: getDashboardSessionHeaders(),
    query: DASHBOARD_DEFAULT_QUERY,
  })

  return response.totalItems
}

export const getUnitManagementKpisEndpoint = async (): Promise<UnitManagementKpis> => {
  return await withApiLoading(async () => {
    return await $fetch<UnitManagementKpis>(DASHBOARD_API_ENDPOINTS.unitManagementKpis, {
      method: 'GET',
      headers: getDashboardSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchUnitManagementKpis)
}


export const getDashboardTopKpisEndpoint = async (parameters: DashboardParameters): Promise<DashboardTopKpis> => {
  return await withApiLoading(async () => {
    return await $fetch<DashboardTopKpis>(DASHBOARD_API_ENDPOINTS.topKpis, {
      method: 'GET',
      headers: getDashboardSessionHeaders(),
      query: parameters,
    })
  }, API_LOADING_MESSAGES.fetchDashboardTopKpis)
}

export const getDashboardPersonnelDeploymentSummaryEndpoint = async (parameters: DashboardParameters): Promise<DashboardPersonnelDeploymentSummary> => {
  return await withApiLoading(async () => {
    return await $fetch<DashboardPersonnelDeploymentSummary>(DASHBOARD_API_ENDPOINTS.personnelDeploymentSummary, {
      method: 'GET',
      headers: getDashboardSessionHeaders(),
      query: parameters,
    })
  }, API_LOADING_MESSAGES.fetchDashboardPersonnelDeploymentSummary)
}

export const getDashboardEquipmentStatusOverviewEndpoint = async (parameters: DashboardParameters): Promise<DashboardEquipmentStatusOverview> => {
  return await withApiLoading(async () => {
    return await $fetch<DashboardEquipmentStatusOverview>(DASHBOARD_API_ENDPOINTS.equipmentStatusOverview, {
      method: 'GET',
      headers: getDashboardSessionHeaders(),
      query: parameters,
    })
  }, API_LOADING_MESSAGES.fetchDashboardEquipmentStatusOverview)
}

export const getDashboardCriticalPersonnelEndpoint = async (parameters: DashboardParameters): Promise<DashboardCriticalPersonnel> => {
  return await withApiLoading(async () => {
    return await $fetch<DashboardCriticalPersonnel>(DASHBOARD_API_ENDPOINTS.criticalPersonnel, {
      method: 'GET',
      headers: getDashboardSessionHeaders(),
      query: parameters,
    })
  }, API_LOADING_MESSAGES.fetchDashboardCriticalPersonnel)
}

export const getDashboardCriticalEquipmentEndpoint = async (parameters: DashboardParameters): Promise<DashboardCriticalEquipment> => {
  return await withApiLoading(async () => {
    return await $fetch<DashboardCriticalEquipment>(DASHBOARD_API_ENDPOINTS.criticalEquipment, {
      method: 'GET',
      headers: getDashboardSessionHeaders(),
      query: parameters,
    })
  }, API_LOADING_MESSAGES.fetchDashboardCriticalEquipment)
}

export const getDashboardNearRotationEndpoint = async (parameters: DashboardParameters): Promise<DashboardNearRotation> => {
  return await withApiLoading(async () => {
    return await $fetch<DashboardNearRotation>(DASHBOARD_API_ENDPOINTS.nearRotation, {
      method: 'GET',
      headers: getDashboardSessionHeaders(),
      query: parameters,
    })
  }, API_LOADING_MESSAGES.fetchDashboardNearRotation)
}

export const getDashboardLocationLoadAnalysisEndpoint = async (parameters: DashboardParameters): Promise<DashboardLocationLoadAnalysis> => {
  return await withApiLoading(async () => {
    return await $fetch<DashboardLocationLoadAnalysis>(DASHBOARD_API_ENDPOINTS.locationLoadAnalysis, {
      method: 'GET',
      headers: getDashboardSessionHeaders(),
      query: parameters,
    })
  }, API_LOADING_MESSAGES.fetchDashboardLocationLoadAnalysis)
}

export const getDashboardPersonnelDeploymentHistoryEndpoint = async (parameters: DashboardParameters): Promise<DashboardPersonnelDeploymentHistory> => {
  return await withApiLoading(async () => {
    return await $fetch<DashboardPersonnelDeploymentHistory>(DASHBOARD_API_ENDPOINTS.personnelDeploymentHistory, {
      method: 'GET',
      headers: getDashboardSessionHeaders(),
      query: parameters,
    })
  }, API_LOADING_MESSAGES.fetchDashboardPersonnelDeploymentHistory)
}

export const getDashboardOperationalTimeMonitoringEndpoint = async (parameters: DashboardParameters): Promise<DashboardOperationalTimeMonitoring> => {
  return await withApiLoading(async () => {
    return await $fetch<DashboardOperationalTimeMonitoring>(DASHBOARD_API_ENDPOINTS.operationalTimeMonitoring, {
      method: 'GET',
      headers: getDashboardSessionHeaders(),
      query: parameters,
    })
  }, API_LOADING_MESSAGES.fetchDashboardOperationalTimeMonitoring)
}
