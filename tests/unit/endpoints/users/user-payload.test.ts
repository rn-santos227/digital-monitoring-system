import { describe, expect, it } from 'vitest'

import {
  normalizeAccountTypeIds,
  parseActivationPayload,
  parseCreateUserProfilePayload,
  parsePasswordUpdatePayload,
} from '../../../../server/shared/validations/domain/user-management'


describe('user endpoint payloads', () => {
  it('normalizes a new user and enforces one account type', () => {
    expect(parseCreateUserProfilePayload({
      email: ' OPERATOR@EXAMPLE.MIL ',
      fullName: ' Juan Dela Cruz ',
      password: ' secure-password ',
      accountTypeIds: ['operator'],
    })).toEqual({
      personnelId: null,
      email: 'operator@example.mil',
      fullName: 'Juan Dela Cruz',
      avatarUrl: null,
      password: 'secure-password',
      accountTypeIds: ['operator'],
    })
  })

  it('rejects multiple account types', () => {
    expect(() => normalizeAccountTypeIds(['admin', 'operator'])).toThrow(
      'Only one account type can be assigned to a user.',
    )
  })

  it('validates password and activation mutation payloads', () => {
    expect(parsePasswordUpdatePayload({
      currentPassword: 'old-password',
      newPassword: ' new-password ',
    })).toEqual({
      currentPassword: 'old-password',
      newPassword: 'new-password',
    })
  })
})
