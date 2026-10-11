import { expect, it } from 'vitest'

import {
  validateCreateBattalionForm,
  validateCreateCompanyForm,
} from '@/app/utils/units-validation'
import { defineFormContractTests } from '@/tests/helpers/form-contract'

defineFormContractTests({
  name: 'battalion form',
  validate: validateCreateBattalionForm,
  form: { code: ' UNIT ', name: ' Test Battalion ', isActive: false },
  required: ['code', 'name'],
  expected: { code: 'UNIT', name: 'Test Battalion', isActive: false },
})
defineFormContractTests({
  name: 'company form',
  validate: validateCreateCompanyForm,
  form: {
    code: ' CO ',
    name: ' Test Company ',
    battalionId: '123e4567-e89b-42d3-a456-426614174000',
    isActive: true,
  },
  required: ['code', 'name'],
  optional: ['battalionId'],
  expected: { code: 'CO', name: 'Test Company' },
})

it('rejects malformed battalion references and unit labels', () => {
  expect(
    validateCreateCompanyForm({
      battalionId: 'invalid',
      code: 'CO',
      name: 'Company',
      isActive: true,
    }).payload,
  ).toBeNull()
  expect(
    validateCreateBattalionForm({
      code: '<tag>',
      name: 'Battalion',
      isActive: true,
    }).payload,
  ).toBeNull()
})
