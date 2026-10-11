import { describe, expect, it } from 'vitest'

import {
  validateProfileDetailsForm,
  validateProfileEmailForm,
  validateProfileOtherDetailsForm,
  validateProfilePasswordForm,
} from '@/app/utils/profile-settings-validation'
import { defineFormContractTests } from '@/tests/helpers/form-contract'

defineFormContractTests({
  name: 'profile details',
  validate: validateProfileDetailsForm,
  form: { fullName: ' Test User ' },
  required: ['fullName'],
  expected: { fullName: 'Test User' },
})
defineFormContractTests({
  name: 'profile email',
  validate: validateProfileEmailForm,
  form: { email: ' USER@EXAMPLE.TEST ' },
  required: ['email'],
  expected: { email: 'user@example.test' },
})

describe('profile password and avatar', () => {
  it('normalizes optional avatar values', () => {
    expect(validateProfileOtherDetailsForm({ avatarUrl: ' ' }).payload).toEqual(
      { avatarUrl: null },
    )
    expect(
      validateProfileOtherDetailsForm({
        avatarUrl: ' https://example.test/avatar.png ',
      }).payload,
    ).toEqual({ avatarUrl: 'https://example.test/avatar.png' })
  })

  it('requires matching passwords and at least eight characters for a replacement', () => {
    expect(
      validateProfilePasswordForm({
        currentPassword: 'current',
        newPassword: 'password',
        confirmPassword: 'password',
      }).payload,
    ).toEqual({ currentPassword: 'current', newPassword: 'password' })
    expect(
      validateProfilePasswordForm({
        currentPassword: '',
        newPassword: 'short',
        confirmPassword: 'different',
      }).errors,
    ).toMatchObject({
      currentPassword: expect.any(String),
      newPassword: expect.any(String),
      confirmPassword: expect.any(String),
    })
    expect(validateProfileEmailForm({ email: 'invalid' }).payload).toBeNull()
  })
})
