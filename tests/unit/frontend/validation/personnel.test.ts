import { describe, expect, it } from 'vitest'

import { validateCreatePersonnelForm } from '@/app/utils/personnel-validation'
import { defineFormContractTests } from '@/tests/helpers/form-contract'

const form = {
  personnelCode: ' P-1 ',
  serviceNumber: ' S-1 ',
  email: 'person@example.test',
  lastName: ' Person ',
  firstName: ' Test ',
  middleName: ' Middle ',
  sex: 'Male',
  birthdate: '1990-01-01',
  rankId: 'rank',
  companyId: 'company',
  battalionId: 'battalion',
  employmentStatusId: 'Regular',
  serviceStatusId: 'Active Duty',
  contactNumber: '+63 900 123 4567',
  position: 'Operator',
  dateEnlisted: '2020-01-01',
  profileImageUrl: 'https://example.test/avatar.png',
}

defineFormContractTests({
  name: 'personnel creation',
  validate: validateCreatePersonnelForm,
  form,
  required: [
    'personnelCode',
    'serviceNumber',
    'email',
    'lastName',
    'firstName',
    'rankId',
    'employmentStatusId',
    'serviceStatusId',
    'sex',
  ],
  optional: [
    'middleName',
    'birthdate',
    'companyId',
    'contactNumber',
    'position',
    'dateEnlisted',
    'profileImageUrl',
  ],
  expected: {
    personnelCode: 'P-1',
    serviceNumber: 'S-1',
    firstName: 'Test',
    lastName: 'Person',
    sex: 'Male',
  },
})

describe('personnel enum and assignment rules', () => {
  it.each([
    'sex',
    'employmentStatusId',
    'serviceStatusId',
    'email',
    'birthdate',
    'contactNumber',
  ] as const)('rejects invalid %s', (field) => {
    expect(
      validateCreatePersonnelForm({ ...form, [field]: 'invalid' }).errors[
        field
      ],
    ).toBeTruthy()
  })

  it('requires a battalion before a company and permits an unassigned person', () => {
    expect(
      validateCreatePersonnelForm({ ...form, battalionId: '' }).errors
        .battalionId,
    ).toBeTruthy()
    expect(
      validateCreatePersonnelForm({ ...form, companyId: '', battalionId: '' })
        .payload,
    ).toMatchObject({ companyId: null, battalionId: null })
  })
})
