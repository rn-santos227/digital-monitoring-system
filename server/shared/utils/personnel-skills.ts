import type { PersonnelSkillFormValues, PersonnelSkillItem, PersonnelSkillRow } from '../models'
import {
  PERSONNEL_SKILL_NAME_MAX_LENGTH,
  PERSONNEL_SKILL_REFERENCE_MAX_LENGTH,
} from '../constants/lib/personnel-skills'
import { firstRelatedItem } from './relations'
import { UUID_PATTERN } from './regex'

const isRealDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return false
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export const validatePersonnelSkillValues = (form: PersonnelSkillFormValues): Record<string, string> => {
  const errors: Record<string, string> = {}
  if (!form.name.trim() || form.name.trim().length > PERSONNEL_SKILL_NAME_MAX_LENGTH) {
    errors.name = `Skill name is required and must not exceed ${PERSONNEL_SKILL_NAME_MAX_LENGTH} characters.`
  }
  if (form.source !== 'training' && form.source !== 'external') {
    errors.source = 'Select training or an external reference as the skill source.'
  }
  if (form.source === 'training' && !UUID_PATTERN.test(form.trainingRecordId.trim())) {
    errors.trainingRecordId = 'Select a supporting training record for this personnel.'
  }
  if (form.source === 'external' && !form.externalReference.trim()) {
    errors.externalReference = 'An external reference is required for an externally obtained skill.'
  }
  if (form.source === 'external' && form.externalReference.trim().length > PERSONNEL_SKILL_REFERENCE_MAX_LENGTH) {
    errors.externalReference = `External reference must not exceed ${PERSONNEL_SKILL_REFERENCE_MAX_LENGTH} characters.`
  }
  for (const field of ['dateObtained', 'validUntil'] as const) {
    if (form[field] && !isRealDate(form[field])) errors[field] = 'Enter a valid date.'
  }
  if (!errors.dateObtained && !errors.validUntil && form.dateObtained && form.validUntil && form.validUntil < form.dateObtained) {
    errors.validUntil = 'Valid until cannot be earlier than the date obtained.'
  }
  return errors
}

export const mapPersonnelSkill = (row: PersonnelSkillRow): PersonnelSkillItem => {
  const training = firstRelatedItem(row.training_record)
  const status = firstRelatedItem(training?.training_status)
  return {
    id: row.id,
    personnelId: row.personnel_id,
    name: row.qualification_type,
    dateObtained: row.date_obtained,
    validUntil: row.valid_until,
    source: row.skill_source,
    trainingRecordId: row.training_record_id,
    trainingTitle: training?.training_title ?? null,
    trainingRecordNo: training?.record_no ?? null,
    trainingStatus: status?.name ?? null,
    certificateNo: training?.certificate_no ?? null,
    externalReference: row.external_reference,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
