import type { PersonnelHistoryKind, PersonnelHistoryRow, PersonnelHistoryValues, PersonnelHistoryItem } from '../models'
import {
  PERSONNEL_HISTORY_ORGANIZATION_MAX_LENGTH,
  PERSONNEL_HISTORY_DESCRIPTION_MAX_LENGTH,
  PERSONNEL_HISTORY_REFERENCE_MAX_LENGTH,
  PERSONNEL_HISTORY_REMARKS_MAX_LENGTH,
} from '../constants/lib/personnel-history'

export const isValidPersonnelRecordDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return false
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export const validatePersonnelHistoryValues = (values: PersonnelHistoryValues, kind: PersonnelHistoryKind): Record<string, string> => {
  const errors: Record<string, string> = {}
  const organizationLabel = kind === 'employment' ? 'Employer' : 'Institution'
  const descriptionLabel = kind === 'employment' ? 'Job title' : 'Qualification or program'
  if (!values.organization.trim() || values.organization.trim().length > PERSONNEL_HISTORY_ORGANIZATION_MAX_LENGTH) {
    errors.organization = `${organizationLabel} is required and must not exceed ${PERSONNEL_HISTORY_ORGANIZATION_MAX_LENGTH} characters.`
  }
  if (!values.description.trim() || values.description.trim().length > PERSONNEL_HISTORY_DESCRIPTION_MAX_LENGTH) {
    errors.description = `${descriptionLabel} is required and must not exceed ${PERSONNEL_HISTORY_DESCRIPTION_MAX_LENGTH} characters.`
  }
  if (kind === 'education' && values.educationLevel.length > 100) errors.educationLevel = 'Education level must not exceed 100 characters.'
  if (values.reference.length > PERSONNEL_HISTORY_REFERENCE_MAX_LENGTH) errors.reference = 'Reference must not exceed 1000 characters.'
  if (values.remarks.length > PERSONNEL_HISTORY_REMARKS_MAX_LENGTH) errors.remarks = 'Remarks must not exceed 3000 characters.'
  for (const field of ['startDate', 'endDate'] as const) {
    if (values[field] && !isValidPersonnelRecordDate(values[field])) errors[field] = 'Enter a valid date.'
  }
  if (!errors.startDate && !errors.endDate && values.startDate && values.endDate && values.endDate < values.startDate) {
    errors.endDate = 'End date cannot be earlier than the start date.'
  }
  return errors
}

export const mapPersonnelHistoryItem = (row: PersonnelHistoryRow, kind: PersonnelHistoryKind): PersonnelHistoryItem => ({
  id: row.id,
  personnelId: row.personnel_id,
  organization: kind === 'employment' ? (row.employer_name ?? '') : (row.institution_name ?? ''),
  description: kind === 'employment' ? (row.job_title ?? '') : (row.qualification_name ?? ''),
  educationLevel: row.education_level ?? null,
  startDate: row.start_date,
  endDate: row.end_date,
  reference: row.reference,
  remarks: row.remarks,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})
