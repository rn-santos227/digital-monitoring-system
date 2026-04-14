import { API_LOADING_MESSAGES, AUDIT_API_ENDPOINTS } from '~/constants/api.constants'
import type { AuditLogDetail, AuditLogListQuery, AuditLogListResponse } from '~/types/domain/audit'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const getAuditLogsEndpoint = async (query: AuditLogListQuery): Promise<AuditLogListResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<AuditLogListResponse>(AUDIT_API_ENDPOINTS.logs, {
      method: 'GET',
      headers: createSessionHeaders(),
      query,
    })
  }, API_LOADING_MESSAGES.fetchAuditLogs)
}

export const getAuditLogByIdEndpoint = async (id: string): Promise<AuditLogDetail> => {
  return await withApiLoading(async () => {
    return await $fetch<AuditLogDetail>(AUDIT_API_ENDPOINTS.logById(id), {
      method: 'GET',
      headers: createSessionHeaders(),
    })
  }, API_LOADING_MESSAGES.fetchAuditLogDetail)
}
