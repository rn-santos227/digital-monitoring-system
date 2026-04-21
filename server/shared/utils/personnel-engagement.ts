import type { PersonnelEngagementRecordListRow } from '../models'
import type { PersonnelEngagementRecordListItem } from '../responses'

const toSingleLinkedReference = (value: { name?: string | null } | { name?: string | null }[] | null) => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

export const mapPersonnelEngagementRecordListItem = (
  row: PersonnelEngagementRecordListRow,
): PersonnelEngagementRecordListItem => {
  const type = toSingleLinkedReference(row.engagement_type)
  const status = toSingleLinkedReference(row.engagement_status)

  return {
    id: row.id,
    title: row.engagement_title,
    type: type?.name ?? 'Unknown',
    status: status?.name ?? 'Unknown',
    dateStart: row.date_start,
    dateEnd: row.date_end,
    remarks: row.remarks,
  }
}
