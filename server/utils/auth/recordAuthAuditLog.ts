import type { H3Event } from 'h3'
import { recordApiAuditLog } from '../audit/recordApiAuditLog'

export const recordAuthAuditLog = async (
  event: H3Event,
  input: Parameters<typeof recordApiAuditLog>[1],
): Promise<void> => {
  try {
    await recordApiAuditLog(event, input)
  } catch (auditError) {
    console.error('Failed to persist authentication audit log.', auditError)
  }
}
