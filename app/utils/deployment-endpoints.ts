import { API_LOADING_MESSAGES, DEPLOYMENT_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  CreateDeploymentPayload,
  DeploymentManagementListItem,
  DeploymentManagementListResponse,
  DeploymentManagementSearchQuery,
} from '~/types/domain/deployment'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

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
