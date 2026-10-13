import type { PersonnelSkillFormValues, PersonnelSkillItem, PersonnelSkillTrainingRow, SavePersonnelSkillRequest } from '~/types/domain/personnel-skills'
import { PERSONNEL_SKILL_NOT_RECORDED, PERSONNEL_SKILL_SOURCE_LABELS } from '~/constants/page.constants'
import { validatePersonnelSkillValues } from '../../server/shared/utils/personnel-skills'
import { firstRelatedItem } from '../../server/shared/utils/relations'

export const mapPersonnelSkillTrainingOption = (item: PersonnelSkillTrainingRow) => ({
  value: item.id,
  label: item.training_title,
  description: [item.record_no, firstRelatedItem(item.training_status)?.name, item.certificate_no].filter(Boolean).join(' · '),
})

export const validatePersonnelSkillForm = (form: PersonnelSkillFormValues) => {
  const values = {
    ...form,
    name: form.name.trim(),
    externalReference: form.externalReference.trim(),
    trainingRecordId: form.trainingRecordId.trim(),
  }
  const errors = validatePersonnelSkillValues(values)
  const payload: SavePersonnelSkillRequest | null = Object.keys(errors).length === 0 ? {
    name: values.name,
    source: values.source,
    trainingRecordId: values.source === 'training' ? values.trainingRecordId : null,
    externalReference: values.source === 'external' ? values.externalReference : null,
    dateObtained: values.dateObtained || null,
    validUntil: values.validUntil || null,
  } : null
  return { errors, payload }
}

export const toPersonnelSkillForm = (item: PersonnelSkillItem | null): PersonnelSkillFormValues => ({
  name: item?.name ?? '',
  source: item ? (item.source ?? 'external') : 'training',
  trainingRecordId: item?.trainingRecordId ?? '',
  externalReference: item?.externalReference ?? '',
  dateObtained: item?.dateObtained ?? '',
  validUntil: item?.validUntil ?? '',
})

export const mapPersonnelSkillTableRow = (item: PersonnelSkillItem) => ({
  ...item,
  sourceLabel: item.source ? PERSONNEL_SKILL_SOURCE_LABELS[item.source] : PERSONNEL_SKILL_NOT_RECORDED,
  evidence: item.source === 'training'
    ? [item.trainingTitle, item.trainingRecordNo, item.trainingStatus, item.certificateNo].filter(Boolean).join(' · ')
    : (item.externalReference ?? PERSONNEL_SKILL_NOT_RECORDED),
})
