import { describe, expect, it } from 'vitest'

import {
  validateCreateDeploymentForm,
  validateCreateDeploymentRecordForm,
  validateUpdateDeploymentRecordForm,
} from '@/app/utils/deployment-validation'
import { defineFormContractTests } from '@/tests/helpers/form-contract'

const form = {
  deploymentArea: ' Test Area ',
  assignmentRole: ' Operator ',
  deploymentAreaLatitude: '12.5',
  deploymentAreaLongitude: '121.4',
  operationName: ' Operation ',
  startDate: '2026-10-04',
  endDate: '2026-10-05',
  statusId: 'status',
  location: ' HQ ',
  supervisorId: 'supervisor',
  defaultRemarks: ' Test ',
}
const record = {
  personnel_id: 'personnel',
  deployment_id: 'deployment',
  assignment_role: ' Operator ',
  deployment_area: ' Test Area ',
  deployment_area_latitude: '12.5',
  deployment_area_longitude: '121.4',
  start_date: '2026-10-04',
  end_date: '2026-10-05',
  remarks: ' Test ',
  location: ' HQ ',
}

defineFormContractTests({
  name: 'deployment form',
  validate: validateCreateDeploymentForm,
  form,
  required: ['deploymentArea', 'startDate', 'statusId'],
  optional: [
    'assignmentRole',
    'deploymentAreaLatitude',
    'deploymentAreaLongitude',
    'operationName',
    'endDate',
    'location',
    'supervisorId',
    'defaultRemarks',
  ],
  expected: {
    deploymentArea: 'Test Area',
    deploymentAreaLatitude: 12.5,
    deploymentAreaLongitude: 121.4,
    remarks: 'Test',
  },
})
defineFormContractTests({
  name: 'deployment record create',
  validate: validateCreateDeploymentRecordForm,
  form: record,
  required: ['personnel_id', 'deployment_id', 'deployment_area', 'start_date'],
  optional: [
    'assignment_role',
    'deployment_area_latitude',
    'deployment_area_longitude',
    'end_date',
    'remarks',
  ],
  expected: {
    deployment_area: 'Test Area',
    deployment_area_latitude: 12.5,
    remarks: 'Test',
  },
})
defineFormContractTests({
  name: 'deployment record update',
  validate: validateUpdateDeploymentRecordForm,
  form: record,
  required: ['deployment_area', 'start_date'],
  optional: [
    'assignment_role',
    'deployment_area_latitude',
    'deployment_area_longitude',
    'end_date',
    'remarks',
    'location',
  ],
  expected: { deployment_area: 'Test Area', location: 'HQ' },
})

describe('deployment coordinates and dates', () => {
  it.each(['invalid', '-91', '91', 'Infinity'])(
    'rejects invalid latitude %s across forms',
    (latitude) => {
      expect(
        validateCreateDeploymentForm({
          ...form,
          deploymentAreaLatitude: latitude,
        }).payload,
      ).toBeNull()
      expect(
        validateCreateDeploymentRecordForm({
          ...record,
          deployment_area_latitude: latitude,
        }).payload,
      ).toBeNull()
      expect(
        validateUpdateDeploymentRecordForm({
          ...record,
          deployment_area_latitude: latitude,
        }).payload,
      ).toBeNull()
    },
  )

  it.each(['invalid', '-181', '181'])(
    'rejects invalid longitude %s across forms',
    (longitude) => {
      expect(
        validateCreateDeploymentForm({
          ...form,
          deploymentAreaLongitude: longitude,
        }).payload,
      ).toBeNull()
      expect(
        validateCreateDeploymentRecordForm({
          ...record,
          deployment_area_longitude: longitude,
        }).payload,
      ).toBeNull()
      expect(
        validateUpdateDeploymentRecordForm({
          ...record,
          deployment_area_longitude: longitude,
        }).payload,
      ).toBeNull()
    },
  )

  it('rejects reversed date ranges', () => {
    expect(
      validateCreateDeploymentForm({ ...form, endDate: '2026-10-03' }).errors
        .endDate,
    ).toBeTruthy()
    expect(
      validateCreateDeploymentRecordForm({ ...record, end_date: '2026-10-03' })
        .errors.end_date,
    ).toBeTruthy()
    expect(
      validateUpdateDeploymentRecordForm({ ...record, end_date: '2026-10-03' })
        .errors.end_date,
    ).toBeTruthy()
  })
})
