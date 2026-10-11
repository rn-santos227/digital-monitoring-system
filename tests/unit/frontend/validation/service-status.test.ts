import { describe, expect, it } from 'vitest'

import {
  validateQuickAssignDeploymentForm,
  validateQuickAssignEngagementForm,
  validateQuickAssignTrainingForm,
} from '@/app/utils/service-status-validation'
import { defineFormContractTests } from '@/tests/helpers/form-contract'

const id = '123e4567-e89b-12d3-a456-426614174000'
const deployment = {
  deployment_id: id,
  assignment_role: '',
  deployment_area: ' Area ',
  deployment_area_latitude: '',
  deployment_area_longitude: '',
  start_date: '2026-10-04',
  end_date: '',
  remarks: '',
}
const engagement = {
  engagement_id: id,
  certificate_no: '',
  valid_until: '',
  remarks: '',
}
const training = {
  training_id: id,
  certificate_no: '',
  valid_until: '',
  remarks: '',
}

defineFormContractTests({
  name: 'quick deployment assignment',
  validate: validateQuickAssignDeploymentForm,
  form: deployment,
  required: ['deployment_id', 'deployment_area', 'start_date'],
  optional: [
    'assignment_role',
    'deployment_area_latitude',
    'deployment_area_longitude',
    'end_date',
    'remarks',
  ],
  expected: { deployment_id: id, deployment_area: 'Area' },
})
defineFormContractTests({
  name: 'quick engagement assignment',
  validate: validateQuickAssignEngagementForm,
  form: engagement,
  required: ['engagement_id'],
  optional: ['certificate_no', 'valid_until', 'remarks'],
  expected: { engagement_id: id, remarks: null },
})
defineFormContractTests({
  name: 'quick training assignment',
  validate: validateQuickAssignTrainingForm,
  form: training,
  required: ['training_id'],
  optional: ['certificate_no', 'valid_until', 'remarks'],
  expected: { trainingId: id, certificateNo: null },
})

describe('quick assignment constraints', () => {
  it('leaves personnel selection to the caller', () => {
    expect(
      validateQuickAssignDeploymentForm(deployment).payload,
    ).not.toHaveProperty('personnel_id')
    expect(
      validateQuickAssignEngagementForm(engagement).payload,
    ).not.toHaveProperty('personnel_id')
    expect(
      validateQuickAssignTrainingForm(training).payload,
    ).not.toHaveProperty('personnelId')
  })

  it('rejects unknown identifiers and invalid certificates', () => {
    expect(
      validateQuickAssignEngagementForm({
        ...engagement,
        engagement_id: 'invalid',
      }).payload,
    ).toBeNull()
    expect(
      validateQuickAssignTrainingForm({ ...training, training_id: 'invalid' })
        .payload,
    ).toBeNull()
    expect(
      validateQuickAssignTrainingForm({
        ...training,
        certificate_no: '<script>',
      }).payload,
    ).toBeNull()
    expect(
      validateQuickAssignEngagementForm({
        ...engagement,
        certificate_no: '<script>',
      }).payload,
    ).toBeNull()
  })

  it('rejects reversed deployment dates', () => {
    expect(
      validateQuickAssignDeploymentForm({
        ...deployment,
        end_date: '2026-10-03',
      }).payload,
    ).toBeNull()
  })
})
