import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { BulkDeleteApiRequest } from '../../shared/requests'
import type { BulkMutationApiResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
} from '../../shared/constants'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import {
  getBulkDomainDefinition,
  parseBulkIds,
} from '../../shared/utils/bulk-management'
import { assertBulkRowsUnused } from '../../utils/bulk/assertBulkRowsUnused'
import { deleteBulkRows } from '../../utils/bulk/deleteBulkRows'
import { readBulkRows } from '../../utils/bulk/readBulkRows'
import { requireBulkPermission } from '../../utils/bulk/requireBulkPermission'

export default defineEventHandler(
  async (event): Promise<BulkMutationApiResponse> => {
    const domain = getRouterParam(event, 'domain') ?? ''
    const definition = getBulkDomainDefinition(domain)
    if (!definition?.deletePermissions?.length)
      throw createError({
        statusCode: 404,
        statusMessage: 'Bulk delete is not supported for this domain.',
      })

    const actor = await requireBulkPermission(
      event,
      definition.deletePermissions,
    )
    const body = await readBody<BulkDeleteApiRequest>(event)
    const supabase = getServiceSupabaseClient()
    let oldRows: Record<string, unknown>[] = []

    try {
      const ids = parseBulkIds(body.ids)
      oldRows = await readBulkRows(supabase, definition.table, ids)
      const foundIds = new Set(oldRows.map((row) => String(row.id ?? '')))
      const missingIds = ids.filter((id) => !foundIds.has(id))
      if (missingIds.length > 0)
        throw createError({
          statusCode: 404,
          statusMessage: `Records not found: ${missingIds.join(', ')}. No records were deleted.`,
        })

      await assertBulkRowsUnused(supabase, ids, definition.deleteReferences)
      await deleteBulkRows(supabase, definition.table, ids)
      await recordManagementAuditLog(event, {
        userId: actor.id,
        action: AUDIT_LOG_ACTIONS.bulkDelete,
        tableName: definition.table,
        endpoint: AUDIT_LOG_ENDPOINTS.domainBulkDelete,
        requestData: body,
        oldData: { items: oldRows },
        statusCode: 200,
        outcome: AUDIT_LOG_OUTCOMES.success,
        message: `${ids.length} ${domain} records deleted successfully.`,
      })
      return { ok: true, affectedCount: ids.length, ids }
    } catch (error: unknown) {
      await recordManagementAuditLog(event, {
        userId: actor.id,
        action: AUDIT_LOG_ACTIONS.bulkDelete,
        tableName: definition.table,
        endpoint: AUDIT_LOG_ENDPOINTS.domainBulkDelete,
        requestData: body,
        oldData: { items: oldRows },
        statusCode: 500,
        outcome: AUDIT_LOG_OUTCOMES.failed,
        message: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  },
)
