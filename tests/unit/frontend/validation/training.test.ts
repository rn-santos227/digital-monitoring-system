import { describe, expect, it } from 'vitest'

import {
  validateCreateTrainingCategoryForm,
  validateCreateTrainingForm,
  validateCreateTrainingRecordForm,
  validateUpdateTrainingCategoryForm,
  validateUpdateTrainingForm,
  validateUpdateTrainingRecordForm,
} from '@/app/utils/training-validation'
import { defineFormContractTests } from '@/tests/helpers/form-contract'

const id = '123e4567-e89b-42d3-a456-426614174000'
const training = {
  trainingTitle: ' Test Training ',
  trainingCategoryId: id,
  statusId: 'Planned',
  levelId: 'Local',
  startDate: '2026-10-04',
  endDate: '2026-10-05',
  defaultRemarks: ' Test ',
}
const category = { code: ' basic ', name: ' Basic Training ' }
const record = {
  trainingId: id,
  personnelId: id,
  certificateNo: ' CERT-1 ',
  validUntil: '2027-01-01',
  remarks: ' Test ',
}

for (const [name, validate] of [
  ['create', validateCreateTrainingForm],
  ['update', validateUpdateTrainingForm],
] as const) {
  defineFormContractTests({
    name: `${name} training`,
    validate,
    form: training,
    required: ['trainingTitle', 'statusId'],
    optional: [
      'trainingCategoryId',
      'levelId',
      'startDate',
      'endDate',
      'defaultRemarks',
    ],
    expected: { trainingTitle: 'Test Training', defaultRemarks: 'Test' },
  })
}
for (const [name, validate] of [
  ['create', validateCreateTrainingCategoryForm],
  ['update', validateUpdateTrainingCategoryForm],
] as const) {
  defineFormContractTests({
    name: `${name} training category`,
    validate,
    form: category,
    required: ['code', 'name'],
    expected: { code: 'BASIC', name: 'Basic Training' },
  })
}
for (const [name, validate] of [
  ['create', validateCreateTrainingRecordForm],
  ['update', validateUpdateTrainingRecordForm],
] as const) {
  defineFormContractTests({
    name: `${name} training record`,
    validate,
    form: record,
    required: ['trainingId', 'personnelId'],
    optional: ['certificateNo', 'validUntil', 'remarks'],
    expected: { trainingId: id, certificateNo: 'CERT-1', remarks: 'Test' },
  })
}

describe('training form boundaries', () => {
  it('rejects reversed dates and malformed UUIDs', () => {
    expect(
      validateCreateTrainingForm({ ...training, endDate: '2026-10-03' }).errors
        .endDate,
    ).toBeTruthy()
    expect(
      validateCreateTrainingForm({ ...training, trainingCategoryId: 'invalid' })
        .errors.trainingCategoryId,
    ).toBeTruthy()
    expect(
      validateCreateTrainingRecordForm({ ...record, personnelId: 'invalid' })
        .errors.personnelId,
    ).toBeTruthy()
  })
})
