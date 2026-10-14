import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchUserPrivilegeClaims } from '@/server/utils/auth/privileges'
import { getServiceSupabaseClient } from '@/server/utils/auth/serviceClient'
import { createSupabaseMock } from '@/tests/helpers/supabase'

vi.mock('@/server/utils/auth/serviceClient', () => ({
  getServiceSupabaseClient: vi.fn(),
}))

describe('session privilege claims', () => {
  beforeEach(() => vi.resetAllMocks())

  it('collects and deduplicates account types and permissions while tolerating missing relations', async () => {
    const database = createSupabaseMock([
      {
        data: [
          {
            account_types: {
              code: 'operator',
              account_type_permissions: [
                { permissions: { code: 'personnel.view' } },
                { permissions: null },
              ],
            },
          },
          {
            account_types: {
              code: 'operator',
              account_type_permissions: [
                { permissions: { code: 'personnel.view' } },
                { permissions: { code: 'equipment.view' } },
              ],
            },
          },
          { account_types: { code: '', account_type_permissions: null } },
          { account_types: null },
        ],
        error: null,
      },
    ])
    vi.mocked(getServiceSupabaseClient).mockReturnValue(database.client)
    await expect(fetchUserPrivilegeClaims('user')).resolves.toEqual({
      accountTypeCodes: ['operator'],
      permissionCodes: ['personnel.view', 'equipment.view'],
    })
    expect(database.calls).toContainEqual({
      table: 'user_account_types',
      method: 'eq',
      args: ['user_id', 'user'],
    })
  })

  it.each([null, []])(
    'returns empty claims for missing memberships %j',
    async (data) => {
      vi.mocked(getServiceSupabaseClient).mockReturnValue(
        createSupabaseMock([{ data, error: null }]).client,
      )
      await expect(fetchUserPrivilegeClaims('user')).resolves.toEqual({
        accountTypeCodes: [],
        permissionCodes: [],
      })
    },
  )
})
