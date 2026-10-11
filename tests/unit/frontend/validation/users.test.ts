import { describe, expect, it } from 'vitest'

import {
  validateAccountTypeForm,
  validateUpdateUserProfileForm,
  validateUserPasswordForm,
  validateUserProfileForm,
} from '@/app/utils/users-validation'
import { defineFormContractTests } from '@/tests/helpers/form-contract'

const profile = {
  personnelId: ' person ',
  email: ' USER@EXAMPLE.TEST ',
  fullName: ' Test User ',
  avatarUrl: ' https://example.test/avatar.png ',
  password: 'password123',
  confirmPassword: 'password123',
  accountTypeIds: ['operator'],
}

defineFormContractTests({
  name: 'create user profile',
  validate: validateUserProfileForm,
  form: profile,
  required: ['email', 'fullName', 'password'],
  optional: ['personnelId', 'avatarUrl'],
  expected: {
    personnelId: 'person',
    email: 'user@example.test',
    fullName: 'Test User',
  },
})
defineFormContractTests({
  name: 'update user profile',
  validate: validateUpdateUserProfileForm,
  form: profile,
  required: ['email', 'fullName'],
  optional: ['personnelId', 'avatarUrl'],
  expected: { email: 'user@example.test', fullName: 'Test User' },
})
defineFormContractTests({
  name: 'account type',
  validate: validateAccountTypeForm,
  form: {
    code: ' OPERATOR ',
    name: ' Operator ',
    description: ' Description ',
    isSystem: false,
    permissionIds: ['permission'],
  },
  required: ['code', 'name'],
  optional: ['description'],
  expected: {
    code: 'operator',
    name: 'Operator',
    permissionIds: ['permission'],
  },
})

describe('user access and password validation', () => {
  it.each([{ accountTypeIds: [] }, { accountTypeIds: ['a', 'b'] }])(
    'requires exactly one account type on creation: $accountTypeIds',
    ({ accountTypeIds }) => {
      expect(
        validateUserProfileForm({ ...profile, accountTypeIds }).errors
          .accountTypeIds,
      ).toBeTruthy()
    },
  )

  it('requires an account type on update and validates email and confirmation', () => {
    expect(
      validateUpdateUserProfileForm({ ...profile, accountTypeIds: [] }).payload,
    ).toBeNull()
    expect(
      validateUserProfileForm({ ...profile, email: 'invalid' }).errors.email,
    ).toBeTruthy()
    expect(
      validateUserProfileForm({ ...profile, confirmPassword: 'different' })
        .errors.confirmPassword,
    ).toBeTruthy()
  })

  it('accepts matching passwords and rejects short or mismatched replacements', () => {
    expect(
      validateUserPasswordForm({
        newPassword: 'password123',
        confirmPassword: 'password123',
      }).payload,
    ).toEqual({ newPassword: 'password123' })
    expect(
      validateUserPasswordForm({
        newPassword: 'short',
        confirmPassword: 'short',
      }).payload,
    ).toBeNull()
    expect(
      validateUserPasswordForm({
        newPassword: 'password123',
        confirmPassword: 'different',
      }).errors.confirmPassword,
    ).toBeTruthy()
    expect(
      validateAccountTypeForm({
        code: '<script>',
        name: 'Name',
        description: '',
        isSystem: false,
        permissionIds: [],
      }).payload,
    ).toBeNull()
  })
})
