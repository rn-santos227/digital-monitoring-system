import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SESSION_TOKEN_HEADER_NAME } from '@/server/shared/constants'
import { getUser } from '@/server/utils/auth/getUser'
import { getServiceSupabaseClient } from '@/server/utils/auth/serviceClient'
import { fetchUserPrivilegeClaims } from '@/server/utils/auth/privileges'
import { createTestEvent } from '@/tests/helpers/h3-event'
import { createSupabaseMock } from '@/tests/helpers/supabase'

vi.mock('@/server/utils/auth/serviceClient', () => ({
  getServiceSupabaseClient: vi.fn(),
}))
vi.mock('@/server/utils/auth/privileges', () => ({
  fetchUserPrivilegeClaims: vi.fn(),
}))

const event = () =>
  createTestEvent('/api/auth/session', 'GET', {
    [SESSION_TOKEN_HEADER_NAME]: 'session-token',
  })
const session = { data: { user_id: 'user' }, error: null }

describe('authenticated session resolution', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(fetchUserPrivilegeClaims).mockResolvedValue({
      accountTypeCodes: ['operator'],
      permissionCodes: ['personnel.view'],
    })
  })

  it('returns null without opening a database client when the token is absent', async () => {
    await expect(getUser(createTestEvent())).resolves.toBeNull()
    expect(getServiceSupabaseClient).not.toHaveBeenCalled()
  })

  it('filters revoked and expired sessions before reading a user profile', async () => {
    const database = createSupabaseMock()
    vi.mocked(getServiceSupabaseClient).mockReturnValue(database.client)
    await expect(getUser(event())).resolves.toBeNull()
    expect(database.calls).toContainEqual({
      table: 'auth_sessions',
      method: 'eq',
      args: ['access_token', 'session-token'],
    })
    expect(database.calls).toContainEqual({
      table: 'auth_sessions',
      method: 'is',
      args: ['revoked_at', null],
    })
    expect(database.calls).toContainEqual({
      table: 'auth_sessions',
      method: 'gt',
      args: ['expires_at', expect.any(String)],
    })
    expect(fetchUserPrivilegeClaims).not.toHaveBeenCalled()
  })

  it('returns active profiles with their access claims', async () => {
    const database = createSupabaseMock([
      session,
      {
        data: {
          id: 'user',
          email: 'unit@example.test',
          full_name: 'Unit User',
          is_active: true,
        },
        error: null,
      },
    ])
    vi.mocked(getServiceSupabaseClient).mockReturnValue(database.client)
    await expect(getUser(event())).resolves.toEqual({
      id: 'user',
      email: 'unit@example.test',
      full_name: 'Unit User',
      account_type_codes: ['operator'],
      permission_codes: ['personnel.view'],
    })
    expect(database.auth.admin.getUserById).not.toHaveBeenCalled()
  })

  it('rejects inactive profiles even when the auth provider still recognizes the user', async () => {
    const database = createSupabaseMock([
      session,
      {
        data: {
          id: 'user',
          email: 'unit@example.test',
          full_name: 'Unit User',
          is_active: false,
        },
        error: null,
      },
    ])
    database.auth.admin.getUserById.mockResolvedValue({
      data: {
        user: { id: 'user', email: 'unit@example.test', user_metadata: {} },
      },
    })
    vi.mocked(getServiceSupabaseClient).mockReturnValue(database.client)
    await expect(getUser(event())).resolves.toBeNull()
    expect(database.auth.admin.getUserById).not.toHaveBeenCalled()
  })

  it('supports provider profiles only when a local profile is absent', async () => {
    const database = createSupabaseMock([session, { data: null, error: null }])
    database.auth.admin.getUserById.mockResolvedValue({
      data: {
        user: {
          id: 'user',
          email: 'unit@example.test',
          user_metadata: { full_name: 'Provider User' },
        },
      },
    })
    vi.mocked(getServiceSupabaseClient).mockReturnValue(database.client)
    await expect(getUser(event())).resolves.toMatchObject({
      id: 'user',
      full_name: 'Provider User',
    })
  })

  it('rejects missing provider users or email addresses', async () => {
    const database = createSupabaseMock([session, { data: null, error: null }])
    database.auth.admin.getUserById.mockResolvedValue({ data: { user: null } })
    vi.mocked(getServiceSupabaseClient).mockReturnValue(database.client)
    await expect(getUser(event())).resolves.toBeNull()
  })
})
