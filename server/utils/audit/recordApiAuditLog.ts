import type { H3Event } from 'h3'
import type { LogActionInput } from '../../shared/models'
import { getRequestIpAddress, normalizeAuditRequestHeaders } from '../../shared/utils'
import { logAction } from './logAction'

interface RecordApiAuditLogInput extends Omit<LogActionInput, 'requestHeaders' | 'ipAddress'> {
  includeRequestHeaders?: boolean
}

export const recordApiAuditLog = async (event: H3Event, input: RecordApiAuditLogInput): Promise<void> => {
  await logAction(event, {
    ...input,
    requestHeaders: input.includeRequestHeaders === false ? null : normalizeAuditRequestHeaders(event.node.req.headers),
    ipAddress: getRequestIpAddress(event),
  })
}
