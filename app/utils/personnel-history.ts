import type { PersonnelHistoryKind, PersonnelHistoryItem, PersonnelHistoryValues, SavePersonnelHistoryRequest } from '~/types/domain/personnel-history'
import { validatePersonnelHistoryValues } from '../../server/shared/utils/personnel-history'

export const toPersonnelHistoryForm = (item: PersonnelHistoryItem | null): PersonnelHistoryValues => ({
  organization: item?.organization ?? '', description: item?.description ?? '', educationLevel: item?.educationLevel ?? '',
  startDate: item?.startDate ?? '', endDate: item?.endDate ?? '', reference: item?.reference ?? '', remarks: item?.remarks ?? '',
})

export const validatePersonnelHistoryForm = (form: PersonnelHistoryValues, kind: PersonnelHistoryKind) => {
  const values: PersonnelHistoryValues = {
    organization: form.organization.trim(),
    description: form.description.trim(),
    educationLevel: form.educationLevel.trim(),
    startDate: form.startDate.trim(),
    endDate: form.endDate.trim(),
    reference: form.reference.trim(),
    remarks: form.remarks.trim(),
  }
  const errors = validatePersonnelHistoryValues(values, kind)
  const payload: SavePersonnelHistoryRequest | null = Object.keys(errors).length === 0 ? {
    organization: values.organization,
    description: values.description,
    educationLevel: kind === 'education' ? (values.educationLevel || null) : null,
    startDate: values.startDate || null,
    endDate: values.endDate || null,
    reference: values.reference || null,
    remarks: values.remarks || null,
  } : null
  return { errors, payload }
}
