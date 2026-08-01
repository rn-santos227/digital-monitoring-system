import type { BulkMutationResponse } from '../../server/shared/models'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export const deleteBulkRecordsEndpoint = async (
  domain: string,
  ids: readonly string[],
): Promise<BulkMutationResponse> => {

}
