import type { CreateEngagementPayload } from '~/types/domain/engagement'
import { validateFields } from '~/utils/field-validation'

interface CreateEngagementFormValues {
  engagementTitle: string
  engagementTypeId: string
  levelId: string
  statusId: string
  startDate: string
  endDate: string
  defaultRemarks: string
}

export const validateCreateEngagementForm = (values: CreateEngagementFormValues) => {
  const validation = validateFields([
    { field: 'engagementTitle', label: 'Engagement title', value: values.engagementTitle, maxLength: 160, required: true },
    { field: 'engagementTypeId', label: 'Engagement type', value: values.engagementTypeId, maxLength: 80, required: true },
    { field: 'levelId', label: 'Level', value: values.levelId, maxLength: 80 },
    { field: 'statusId', label: 'Status', value: values.statusId, maxLength: 80, required: true },
    { field: 'startDate', label: 'Start date', value: values.startDate, maxLength: 24 },
    { field: 'endDate', label: 'End date', value: values.endDate, maxLength: 24 },
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
      start_date: validation.values.startDate || null,
      end_date: validation.values.endDate || null,
      default_remarks: validation.values.defaultRemarks || null,
    }

  return {
    errors: validation.errors,
    payload,
  }
}
