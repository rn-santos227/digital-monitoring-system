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
