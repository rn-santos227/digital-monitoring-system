import { beforeEach, describe, expect, it, vi } from 'vitest'

import { serverSupabaseClient } from '#supabase/server'
import { storeSession } from '@/server/utils/auth/storeSession'
import { createTestEvent } from '@/tests/helpers/h3-event'
import { createSupabaseMock } from '@/tests/helpers/supabase'

beforeEach(() => vi.mocked(serverSupabaseClient).mockReset())

describe('session persistence', () => {
  const input = {
    userId: 'user',
    accessToken: 'unit-token',
    provider: 'password',
    expiresAt: '2026-10-05T12:00:00Z',
  }

  it('upserts device-aware session metadata and updates last login after success', async () => {
    const database = createSupabaseMock([
      { data: { id: 'session' }, error: null },
      { data: null, error: null },
    ])
    vi.mocked(serverSupabaseClient).mockResolvedValue(database.client)
    const event = createTestEvent('/api/auth/login', 'POST', {
      'user-agent': 'Unit test',
      'x-forwarded-for': '127.0.0.1',
    })
    expect(await storeSession(event, input)).toEqual({ id: 'session' })
    expect(database.calls).toContainEqual({
      table: 'auth_sessions',
      method: 'upsert',
      args: [
        expect.objectContaining({
          user_id: 'user',
          access_token: 'unit-token',
          refresh_token: null,
          provider: 'password',
          user_agent: 'Unit test',
          expires_at: input.expiresAt,
        }),
        {
          onConflict: 'user_id,provider,user_agent,ip_address',
          ignoreDuplicates: false,
        },
      ],
    })
    expect(database.calls).toContainEqual({
      table: 'user_profiles',
      method: 'update',
      args: [{ last_login_at: expect.any(String) }],
    })
    expect(database.calls).toContainEqual({
      table: 'user_profiles',
      method: 'eq',
      args: ['id', 'user'],
    })
  })

  it('preserves refresh tokens and accepts clients without a user agent', async () => {
    const database = createSupabaseMock([
      { data: { id: 'session' }, error: null },
    ])
    vi.mocked(serverSupabaseClient).mockResolvedValue(database.client)
    await storeSession(createTestEvent(), {
      ...input,
      refreshToken: 'refresh-token',
    })
    expect(database.calls).toContainEqual(
      expect.objectContaining({
        method: 'upsert',
        args: [
          expect.objectContaining({
            refresh_token: 'refresh-token',
            user_agent: null,
          }),
          expect.any(Object),
        ],
      }),
    )
  })

  it('does not update last login if storing the session fails', async () => {
    const database = createSupabaseMock([
      { data: null, error: { message: 'Write rejected' } },
    ])
    vi.mocked(serverSupabaseClient).mockResolvedValue(database.client)
    await expect(storeSession(createTestEvent(), input)).rejects.toThrow(
      'Failed to store auth session: Write rejected',
    )
    expect(database.from).not.toHaveBeenCalledWith('user_profiles')
  })
})
