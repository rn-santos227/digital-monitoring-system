import type { CreateEngagementPayload } from '~/types/domain/engagement'
import { validateFields } from '~/utils/field-validation'

interface CreateEngagementFormValues {
  engagementTitle: string
  engagementTypeId: string
  levelId: string
  statusId: string
  dateStart: string
  dateEnd: string
  defaultRemarks: string
}

export const validateCreateEngagementForm = (values: CreateEngagementFormValues) => {
  const validation = validateFields([
    { field: 'engagementTitle', label: 'Engagement title', value: values.engagementTitle, maxLength: 160, required: true },
    { field: 'engagementTypeId', label: 'Engagement type', value: values.engagementTypeId, maxLength: 80, required: true },
    { field: 'levelId', label: 'Level', value: values.levelId, maxLength: 80 },
    { field: 'statusId', label: 'Status', value: values.statusId, maxLength: 80, required: true },
    { field: 'dateStart', label: 'Start date', value: values.dateStart, maxLength: 24 },
    { field: 'dateEnd', label: 'End date', value: values.dateEnd, maxLength: 24 },
    { field: 'defaultRemarks', label: 'Remarks', value: values.defaultRemarks, maxLength: 500 },
  ])

  const normalizedEngagementTitle = validation.values.engagementTitle ?? ''
  const normalizedEngagementTypeId = validation.values.engagementTypeId ?? ''
  const normalizedStatusId = validation.values.statusId ?? ''

  const payload: CreateEngagementPayload | null = Object.keys(validation.errors).length > 0
    ? null
    : {
      engagement_title: normalizedEngagementTitle,
      engagement_type_id: normalizedEngagementTypeId,
      level_id: validation.values.levelId || null,
      status_id: normalizedStatusId,
      date_start: validation.values.dateStart || null,
      date_end: validation.values.dateEnd || null,
      default_remarks: validation.values.defaultRemarks || null,
    }

  return {
    errors: validation.errors,
    payload,
  }
}
