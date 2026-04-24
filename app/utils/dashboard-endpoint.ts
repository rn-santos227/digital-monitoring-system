import { createSessionHeaders } from '~/utils/auth-session'

interface DashboardCountResponse {
  totalItems: number
}

const DASHBOARD_DEFAULT_QUERY = Object.freeze({
  page: 1,
  pageSize: 1,
})

export const getPersonnelCount = async (): Promise<number> => {
  const response = await $fetch<DashboardCountResponse>('/api/personnel', {
    method: 'GET',
    headers: createSessionHeaders(),
    query: DASHBOARD_DEFAULT_QUERY,
  })

  return response.totalItems
}

export const getBattalionCount = async (): Promise<number> => {
  const response = await $fetch<DashboardCountResponse>('/api/battalions', {
    method: 'GET',
    headers: createSessionHeaders(),
    query: DASHBOARD_DEFAULT_QUERY,
  })

  return response.totalItems
}

export const getCompanyCount = async (): Promise<number> => {
  const response = await $fetch<DashboardCountResponse>('/api/companies', {
    method: 'GET',
    headers: createSessionHeaders(),
    query: DASHBOARD_DEFAULT_QUERY,
  })

  return response.totalItems
}

export const getAccountTypeCount = async (): Promise<number> => {
  const response = await $fetch<DashboardCountResponse>('/api/account-types', {
    method: 'GET',
    headers: createSessionHeaders(),
    query: DASHBOARD_DEFAULT_QUERY,
  })

  return response.totalItems
}
