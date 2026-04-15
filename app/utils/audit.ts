import type { AuditLogListItem, AuditLogTableRow } from '~/types/domain/audit'

const AUDIT_DATETIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'short',
})

export const formatAuditTimestamp = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp)

  if (Number.isNaN(date.getTime())) {
    return isoTimestamp
  }

  return AUDIT_DATETIME_FORMATTER.format(date)
}

export const resolveAuditActorLabel = (item: AuditLogListItem): string => {
  const actorName = item.actor?.fullName?.trim()

  if (actorName) {
    return actorName
  }

  const actorEmail = item.actor?.email?.trim()
  return actorEmail || 'System'
}

export const mapAuditLogItemToTableRow = (item: AuditLogListItem): AuditLogTableRow => {
  return {
    id: item.id,
    actor: resolveAuditActorLabel(item),
    action: item.action,
    tableName: item.tableName,
    recordId: item.recordId ?? 'N/A',
    ipAddress: item.ipAddress ?? 'N/A',
    statusCode: item.statusCode === null ? 'N/A' : String(item.statusCode),
    createdAt: formatAuditTimestamp(item.createdAt),
  }
}

export const formatAuditJson = (value: Record<string, unknown> | Record<string, string> | null): string => {
  if (!value || Object.keys(value).length === 0) {
    return 'No data captured.'
  }

  return JSON.stringify(value, null, 2)
}
