import type { H3Event } from 'h3'
import { describe, expect, it, vi } from 'vitest'

import { requireAuth } from '@/server/utils/auth/requireAuth'
import { getUser } from '@/server/utils/auth/getUser'

vi.mock('@/server/utils/auth/getUser', () => ({ getUser: vi.fn() }))

describe('required authentication', () => {
  it('returns an existing authenticated user', async () => {
    const user = {
      id: 'user',
      email: 'unit@example.test',
      full_name: null,
      account_type_codes: [],
      permission_codes: [],
    }
    vi.mocked(getUser).mockResolvedValueOnce(user)
    await expect(requireAuth({} as H3Event)).resolves.toBe(user)
  })

  it('rejects missing sessions with HTTP 401', async () => {
    vi.mocked(getUser).mockResolvedValueOnce(null)
    await expect(requireAuth({} as H3Event)).rejects.toMatchObject({
      statusCode: 401,
      statusMessage: 'Unauthenticated',
    })
  })
})
