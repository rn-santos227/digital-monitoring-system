import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { BulkUpdateApiRequest } from '../../shared/requests'
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
  parseBulkUpdateItems,
} from '../../shared/utils/bulk-management'
import { readBulkRows } from '../../utils/bulk/readBulkRows'
import { requireBulkPermission } from '../../utils/bulk/requireBulkPermission'
import { updateBulkRow } from '../../utils/bulk/updateBulkRows'
import { executeWithRollback } from '../../utils/db/executeWithRollback'

export default defineEventHandler(
  async (event): Promise<BulkMutationApiResponse> => {
    const domain = getRouterParam(event, 'domain') ?? ''
    const definition = getBulkDomainDefinition(domain)
    if (!definition?.updatePermissions?.length)
      throw createError({
        statusCode: 404,
        statusMessage: 'Bulk update is not supported for this domain.',
      })

    const actor = await requireBulkPermission(
      event,
      definition.updatePermissions,
    )
    const body = await readBody<BulkUpdateApiRequest>(event)
    const supabase = getServiceSupabaseClient()
    let oldRows: Record<string, unknown>[] = []
    let rollbackErrorMessage: string | null = null

    try {
      const items = parseBulkUpdateItems(body.items, definition.writableColumns)
      const ids = items.map((item) => item.id)
      oldRows = await readBulkRows(supabase, definition.table, ids)
      const foundIds = new Set(oldRows.map((row) => String(row.id ?? '')))
      const missingIds = ids.filter((id) => !foundIds.has(id))
      if (missingIds.length > 0)
        throw createError({
          statusCode: 404,
          statusMessage: `Records not found: ${missingIds.join(', ')}. No records were updated.`,
        })
    
      await executeWithRollback({
        operation: async () => {
          for (const item of items)
            await updateBulkRow(
              supabase,
              definition.table,
              item.id,
              item.updates,
            )
        },
        rollback: async () => {
          for (const row of oldRows) {
            const {
              id,
              created_at: _createdAt,
              updated_at: _updatedAt,
              ...updates
            } = row
            await updateBulkRow(
              supabase,
              definition.table,
              String(id ?? ''),
              updates,
            )
          }
        },
        onRollbackError: (error) => {
          rollbackErrorMessage =
            error instanceof Error ? error.message : 'Unknown rollback error'
          console.error(`Failed to rollback ${domain} bulk update.`, error)
        },
      })
    } catch (error: unknown) {

    }
  },
)