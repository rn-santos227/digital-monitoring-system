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

interface CreateEngagementRecordFormValues {
  personnel_id: string
  engagement_id: string
  role: string
  location: string
  start_date: string
  end_date: string
  remarks: string
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

export const validateCreateEngagementRecordForm = (values: CreateEngagementRecordFormValues) => {
  const validation = validateFields([
    { field: 'personnel_id', label: 'Personnel', value: values.personnel_id, maxLength: 80, required: true },
    { field: 'engagement_id', label: 'Engagement', value: values.engagement_id, maxLength: 80, required: true },
    { field: 'role', label: 'Role', value: values.role, maxLength: 120 },
    { field: 'location', label: 'Location', value: values.location, maxLength: 180 },
    { field: 'start_date', label: 'Start date', value: values.start_date, maxLength: 24 },
    { field: 'end_date', label: 'End date', value: values.end_date, maxLength: 24 },
    { field: 'remarks', label: 'Remarks', value: values.remarks, maxLength: 500 },
  ])

  const payload = Object.keys(validation.errors).length > 0
    ? null
    : {
      personnel_id: validation.values.personnel_id ?? '',
      engagement_id: validation.values.engagement_id ?? '',
      role: validation.values.role || null,
      location: validation.values.location || null,
      start_date: validation.values.start_date || null,
      end_date: validation.values.end_date || null,
      remarks: validation.values.remarks || null,
    }

  return { errors: validation.errors, payload }
}
