import { API_LOADING_MESSAGES, DEPLOYMENT_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  CreateDeploymentPayload,
  CreateDeploymentRecordPayload,
  DeploymentManagementListItem,
  DeploymentManagementListResponse,
  DeploymentManagementSearchQuery,
  UpdateDeploymentRecordPayload,
} from '~/types/domain/deployment'
import { withApiLoading } from '~/utils/api-request'

export const getDeploymentsEndpoint = async (query: DeploymentManagementSearchQuery): Promise<DeploymentManagementListResponse<DeploymentManagementListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<DeploymentManagementListResponse<DeploymentManagementListItem>>(DEPLOYMENT_MANAGEMENT_API_ENDPOINTS.deployments, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchDeployments)
}

export const searchDeploymentsEndpoint = async (query: DeploymentManagementSearchQuery): Promise<DeploymentManagementListResponse<DeploymentManagementListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<DeploymentManagementListResponse<DeploymentManagementListItem>>(DEPLOYMENT_MANAGEMENT_API_ENDPOINTS.deploymentsSearch, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchDeployments)
}

export const getDeploymentRecordsEndpoint = async (query: DeploymentManagementSearchQuery): Promise<DeploymentManagementListResponse<DeploymentManagementListItem>> => {
  return await withApiLoading(async () => {
    return await $fetch<DeploymentManagementListResponse<DeploymentManagementListItem>>(DEPLOYMENT_MANAGEMENT_API_ENDPOINTS.deploymentRecords, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchDeploymentRecords)
}

export const createDeploymentEndpoint = async (payload: CreateDeploymentPayload): Promise<{ ok: boolean; id: string }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean; id: string }>(DEPLOYMENT_MANAGEMENT_API_ENDPOINTS.deployments, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.createDeployment)
}

export const createDeploymentRecordEndpoint = async (payload: CreateDeploymentRecordPayload): Promise<{ ok: boolean; id: string }> => {
  return await withApiLoading(async () => 
    await $fetch<{ ok: boolean; id: string }>(DEPLOYMENT_MANAGEMENT_API_ENDPOINTS.deploymentRecords, { 
      method: 'POST',
      headers: createSessionHeaders(),
      body: payload
    }
  ), API_LOADING_MESSAGES.createDeployment)
}

export const getDeploymentByIdEndpoint = async (id: string): Promise<DeploymentManagementListItem> => {
  return await withApiLoading(async () => {
    return await $fetch<DeploymentManagementListItem>(`${DEPLOYMENT_MANAGEMENT_API_ENDPOINTS.deployments}/${id}`, {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchDeployments)
}

export const getDeploymentRecordByIdEndpoint = async (id: string): Promise<DeploymentManagementListItem> => {
  return await withApiLoading(async () => 
    await $fetch<DeploymentManagementListItem>(`${DEPLOYMENT_MANAGEMENT_API_ENDPOINTS.deploymentRecords}/${id}`, { 
      method: 'GET',
      headers: createSessionHeaders()
    }
  ), API_LOADING_MESSAGES.fetchDeploymentRecords)
}

export const updateDeploymentDetailsEndpoint = async (id: string, payload: CreateDeploymentPayload): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(DEPLOYMENT_MANAGEMENT_API_ENDPOINTS.deploymentByIdDetails(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateDeployment)
}

export const updateDeploymentLocationEndpoint = async (id: string, payload: CreateDeploymentPayload): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(DEPLOYMENT_MANAGEMENT_API_ENDPOINTS.deploymentByIdLocation(id), {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload,
    })
  }, API_LOADING_MESSAGES.updateDeployment)
}

export const updateDeploymentRecordEndpoint = async (id: string, payload: UpdateDeploymentRecordPayload): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () =>
    await $fetch<{ ok: boolean }>(`${DEPLOYMENT_MANAGEMENT_API_ENDPOINTS.deploymentRecords}/${id}`, {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: payload 
    }
  ), API_LOADING_MESSAGES.updateDeployment)
}

export const deleteDeploymentEndpoint = async (id: string): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () => {
    return await $fetch<{ ok: boolean }>(`${DEPLOYMENT_MANAGEMENT_API_ENDPOINTS.deployments}/${id}`, {
      method: 'DELETE',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.deleteDeployment)
}

export const deleteDeploymentRecordEndpoint = async (id: string): Promise<{ ok: boolean }> => {
  return await withApiLoading(async () =>
     await $fetch<{ ok: boolean }>(`${DEPLOYMENT_MANAGEMENT_API_ENDPOINTS.deploymentRecords}/${id}`, {
      method: 'DELETE',
      headers: createSessionHeaders()
    }
  ), API_LOADING_MESSAGES.deleteDeployment)
}
