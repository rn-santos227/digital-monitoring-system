import { getRouterParam, readBody } from 'h3'
import type { H3Event } from 'h3'
import { ID_ONLY_SELECT_COLUMNS, PERSONNEL_HISTORY_CONFIG } from '../../shared/constants'
import type { PersonnelHistoryKind } from '../../shared/models'
import { assertPersonnelExists } from '../../shared/utils'
import { parsePersonnelHistoryPayload, requireRouteId } from '../../shared/validation'
import { getServiceSupabaseClient } from '../auth/serviceClient'
import { recordManagementAuditLog } from '../audit/recordManagementAuditLog'
import { getPersonnelHistoryRecord } from './getPersonnelHistoryRecord'
import { writePersonnelHistoryRecord } from './writePersonnelHistoryRecord'
import { deletePersonnelHistoryRecord } from './deletePersonnelHistoryRecord'

export async function mutatePersonnelHistory(event: H3Event, kind: PersonnelHistoryKind, action: 'create' | 'update' | 'delete', userId: string) {
  const config = PERSONNEL_HISTORY_CONFIG[kind]
  let personnelId: string | null = null
  let recordId: string | null = null
  let requestData: object | null = null
  let oldData: object | null = null
  try {
    personnelId = requireRouteId(getRouterParam(event, 'id'), 'Personnel id is required.')
    if (action !== 'create') recordId = requireRouteId(getRouterParam(event, 'recordId'), 'History record id is required.')
    const body: unknown = action === 'delete' ? null : await readBody(event)
    requestData = body && typeof body === 'object' && !Array.isArray(body) ? body : null
    const payload = action === 'delete' ? null : parsePersonnelHistoryPayload(body, kind)
    const supabase = getServiceSupabaseClient()
    await assertPersonnelExists({ supabase, personnelId, idSelectColumns: ID_ONLY_SELECT_COLUMNS })
    if (recordId) oldData = await getPersonnelHistoryRecord(supabase, kind, personnelId, recordId)
    const item = payload
      ? await writePersonnelHistoryRecord(supabase, kind, personnelId, payload, userId, recordId)
      : null
    if (action === 'delete' && recordId) await deletePersonnelHistoryRecord(supabase, kind, personnelId, recordId)
    await recordManagementAuditLog(event, {
      userId, action: `${config.actionPrefix}_${action.toUpperCase()}`, tableName: config.table, endpoint: config.endpoint,
      recordId: item?.id ?? recordId, requestData: { ...requestData, personnelId }, oldData, newData: item,
      statusCode: action === 'create' ? 201 : 200, outcome: 'success',
    })
    return item ? { ok: true as const, id: item.id, item } : { ok: true as const }
  } catch (error) {
    const statusCode = typeof error === 'object' && error && 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : 500
    await recordManagementAuditLog(event, {
      userId, action: `${config.actionPrefix}_${action.toUpperCase()}`, tableName: config.table, endpoint: config.endpoint,
      recordId, requestData: { ...requestData, personnelId }, oldData,
      statusCode, outcome: 'failed', message: error instanceof Error ? error.message : 'Unknown error',
    })
    throw error
  }
}
