import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'
import { validateCreateDeploymentRecordForm } from '~/utils/deployment-validation'
import type { CreateDeploymentRecordPayload } from '~/types/domain/deployment'
import type { CreateEngagementRecordPayload } from '~/types/domain/engagement'
import type { CreateTrainingRecordPayload } from '~/types/domain/training'

export const validateQuickAssignDeploymentForm = (form: {
  deployment_id: string
  assignment_role: string
  deployment_area: string
  deployment_area_latitude: string
  deployment_area_longitude: string
  start_date: string
  end_date: string
  remarks: string
}): { errors: Record<string, string>; payload: Omit<CreateDeploymentRecordPayload, 'personnel_id'> | null } => {
  const result = validateCreateDeploymentRecordForm({
    ...form,
    personnel_id: '00000000-0000-0000-0000-000000000000',
  })

  if (!result.payload) {
    return { errors: result.errors, payload: null }
  }

  const { personnel_id: _personnelId, ...payload } = result.payload

  return { errors: result.errors, payload }
}

export const validateQuickAssignEngagementForm = (form: {
  engagement_id: string
  certificate_no: string
  valid_until: string
  remarks: string
}): { errors: Record<string, string>; payload: Omit<CreateEngagementRecordPayload, 'personnel_id'> | null } => {
  const validation = validateFields([
    { field: 'engagement_id', label: 'Engagement', value: form.engagement_id, maxLength: 80, required: true, pattern: REGEX_PATTERNS.uuid, patternMessage: 'Selected engagement must be valid.' },
    { field: 'certificate_no', label: 'Certificate no.', value: form.certificate_no, maxLength: 120, pattern: REGEX_PATTERNS.alphaNumericSpace, patternMessage: 'Certificate no. allows letters, numbers, spaces, periods, underscores, and hyphens only.' },
    { field: 'remarks', label: 'Remarks', value: form.remarks, maxLength: 500 },
  ])

  const payload = Object.keys(validation.errors).length > 0
    ? null
    : {
      engagement_id: validation.values.engagement_id ?? '',
      role: null,
      location: null,
      start_date: null,
      end_date: null,
      remarks: validation.values.remarks || null,
    }

  return { errors: validation.errors, payload }
}


export const validateQuickAssignTrainingForm = (form: {
  training_id: string
  certificate_no: string
  valid_until: string
  remarks: string
}): { errors: Record<string, string>; payload: Omit<CreateTrainingRecordPayload, 'personnelId'> | null } => {
  const validation = validateFields([
    { field: 'training_id', label: 'Training', value: form.training_id, maxLength: 80, required: true, pattern: REGEX_PATTERNS.uuid, patternMessage: 'Selected training must be valid.' },
    { field: 'certificate_no', label: 'Certificate No.', value: form.certificate_no, maxLength: 120, pattern: REGEX_PATTERNS.alphaNumericSpace, patternMessage: 'Certificate no. allows letters, numbers, spaces, periods, underscores, and hyphens only.' },
    { field: 'remarks', label: 'Remarks', value: form.remarks, maxLength: 500 },
  ])

  const payload = Object.keys(validation.errors).length > 0
    ? null
    : {
      trainingId: validation.values.training_id ?? '',
      certificateNo: validation.values.certificate_no || null,
      validUntil: form.valid_until || null,
      remarks: validation.values.remarks || null,
    }

  return { errors: validation.errors, payload }
}
