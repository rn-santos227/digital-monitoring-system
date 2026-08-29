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
    
    })).toEqual({

    })
  })
})
