import type { BulkMutationResponse } from '../../server/shared/models'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const deleteBulkRecordsEndpoint = async (
  domain: string,
  ids: readonly string[],
): Promise<BulkMutationResponse> => {
 return await withApiLoading(async () => {
    return await $fetch<BulkMutationResponse>(`/api/${encodeURIComponent(domain)}/bulk`, {
      method: 'DELETE',
      headers: createSessionHeaders(),
      body: { ids: [...ids] },
    })
  }, `Deleting ${ids.length} selected record${ids.length === 1 ? '' : 's'}...`)
}

export const updateBulkRecordsEndpoint = async <TUpdates extends object>(
  domain: string,
  ids: readonly string[],
  updates: Readonly<TUpdates>,
): Promise<BulkMutationResponse> => {
  return await withApiLoading(async () => {
    return await $fetch<BulkMutationResponse>(`/api/${encodeURIComponent(domain)}/bulk`, {
      method: 'PATCH',
      headers: createSessionHeaders(),
      body: { items: ids.map((id) => ({ id, updates: { ...updates } })) },
    })
  }, `Updating ${ids.length} selected record${ids.length === 1 ? '' : 's'}...`)
}
