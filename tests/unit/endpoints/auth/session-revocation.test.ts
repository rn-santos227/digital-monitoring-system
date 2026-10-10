import type { SupabaseClient } from '@supabase/supabase-js'
import { describe, expect, it, vi } from 'vitest'
import { revokeSessionByToken } from '../../../../server/utils/auth/revokeSessionByToken'

interface SessionQueryResult {
  data: { user_id: string } | null
  error: { message: string } | null
}

const createClient = (
  session: SessionQueryResult,
  revokeError: { message: string } | null = null,
) => {
  const query = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue(session),
    update: vi.fn().mockReturnThis(),
    is: vi.fn().mockResolvedValue({ error: revokeError }),
  }
  const client = { from: vi.fn().mockReturnValue(query) }

  return { supabase: client as unknown as SupabaseClient, query }
}

describe('session revocation', () => {
  it('revokes the token and returns its user for audit attribution', async () => {
    const { supabase, query } = createClient({
      data: { user_id: 'user-1' },
      error: null,
    })

    await expect(revokeSessionByToken(supabase, 'session-token')).resolves.toBe(
      'user-1',
    )
    expect(query.eq).toHaveBeenNthCalledWith(1, 'access_token', 'session-token')
    expect(query.eq).toHaveBeenNthCalledWith(2, 'access_token', 'session-token')
    expect(query.is).toHaveBeenCalledWith('revoked_at', null)
    expect(query.update).toHaveBeenCalledWith({
      revoked_at: expect.any(String),
    })
  })

  it('supports logout when the token no longer has a session', async () => {
    const { supabase } = createClient({ data: null, error: null })

    await expect(
      revokeSessionByToken(supabase, 'expired-token'),
    ).resolves.toBeNull()
  })

  it('stops before mutation when the session lookup fails', async () => {
    const { supabase, query } = createClient({
      data: null,
      error: { message: 'Database unavailable' },
    })

    await expect(
      revokeSessionByToken(supabase, 'session-token'),
    ).rejects.toThrow('Failed to read the current session.')
    expect(query.update).not.toHaveBeenCalled()
  })

  it('reports a failed revocation instead of claiming logout succeeded', async () => {
    const { supabase } = createClient(
      { data: { user_id: 'user-1' }, error: null },
      { message: 'Write failed' },
    )

    await expect(
      revokeSessionByToken(supabase, 'session-token'),
    ).rejects.toThrow('Failed to revoke the current session.')
  })
})
