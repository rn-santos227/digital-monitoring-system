import type { PersonnelTrainingRecordListRow } from '../models'
import type { PersonnelTrainingRecordListItem } from '../responses'

const toSingleLinkedReference = (value: { name?: string | null } | { name?: string | null }[] | null) => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

export const mapPersonnelTrainingRecordListItem = (row: PersonnelTrainingRecordListRow): PersonnelTrainingRecordListItem => {
  const category = toSingleLinkedReference(row.training_category)
  const status = toSingleLinkedReference(row.training_status)

  return {
    id: row.id,
    title: row.training_title,
    category: category?.name ?? null,
    status: status?.name ?? 'Unknown',
    startDate: row.start_date,
    endDate: row.end_date,
    validUntil: row.valid_until,
    remarks: row.remarks,
  }
}
