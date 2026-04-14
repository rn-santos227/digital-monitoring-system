import type { AuditLogAction, AuditLogListItem, AuditLogTableRow } from '~/types/domain/audit'

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

export const normalizeAuditAction = (action: string): AuditLogAction => {
  if (action === 'INSERT' || action === 'UPDATE' || action === 'DELETE') {
    return action
  }

  return 'UPDATE'
}

export const mapAuditLogItemToTableRow = (item: AuditLogListItem): AuditLogTableRow => {
  return {
    id: item.id,
    actor: resolveAuditActorLabel(item),
    action: normalizeAuditAction(item.action),
    tableName: item.tableName,
    recordId: item.recordId ?? 'N/A',
    createdAt: formatAuditTimestamp(item.createdAt),
  }
}
