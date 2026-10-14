import type { H3Event } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { requireAuth } from '@/server/utils/auth/requireAuth'
import { requirePermission } from '@/server/utils/auth/requirePermission'
import { requireAnyPermission } from '@/server/utils/auth/requireAnyPermission'
import { requireRole } from '@/server/utils/auth/requireRole'
import { serverSupabaseClient } from '@/tests/helpers/supabase-server'
import { createSupabaseMock } from '@/tests/helpers/supabase'

vi.mock('@/server/utils/auth/requireAuth', () => ({ requireAuth: vi.fn() }))
const event = {} as H3Event
const user = {
  id: 'user',
  email: 'unit@example.test',
  full_name: 'Unit',
  account_type_codes: ['operator'],
  permission_codes: ['personnel.view'],
}

describe('server RBAC helpers', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(requireAuth).mockResolvedValue(user)
  })

  it('returns the authenticated user only when the requested privilege exists', async () => {
    await expect(requirePermission(event, 'personnel.view')).resolves.toBe(user)
    await expect(
      requirePermission(event, 'personnel.delete'),
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it('accepts any permitted code and rejects an empty or entirely missing list', async () => {
    await expect(
      requireAnyPermission(event, ['personnel.delete', 'personnel.view']),
    ).resolves.toBe(user)
    await expect(requireAnyPermission(event, [])).rejects.toMatchObject({
      statusCode: 403,
    })
    await expect(
      requireAnyPermission(event, ['personnel.delete']),
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it('does not query role assignments for unauthenticated requests', async () => {
    const failure = new Error('Unauthenticated')
    vi.mocked(requireAuth).mockRejectedValue(failure)
    await expect(requirePermission(event, 'personnel.view')).rejects.toBe(
      failure,
    )
    await expect(requireAnyPermission(event, ['personnel.view'])).rejects.toBe(
      failure,
    )
    await expect(requireRole(event, 'operator')).rejects.toBe(failure)
    expect(serverSupabaseClient).not.toHaveBeenCalled()
  })

  it('checks role membership for the authenticated user', async () => {
    const database = createSupabaseMock([
      { data: [{ id: 'membership' }], error: null },
    ])
    vi.mocked(serverSupabaseClient).mockResolvedValue(database.client)
    await expect(requireRole(event, 'operator')).resolves.toBe(user)
    expect(database.calls).toContainEqual({
      table: 'user_account_types',
      method: 'eq',
      args: ['user_id', 'user'],
    })
    expect(database.calls).toContainEqual({
      table: 'user_account_types',
      method: 'eq',
      args: ['account_types.code', 'operator'],
    })
  })

  it.each([{ data: null }, { data: [] }])(
    'rejects missing role results $data',
    async ({ data }) => {
      vi.mocked(serverSupabaseClient).mockResolvedValue(
        createSupabaseMock([{ data, error: null }]).client,
      )
      await expect(requireRole(event, 'operator')).rejects.toMatchObject({
        statusCode: 403,
      })
    },
  )

  it('distinguishes database failure from a missing role', async () => {
    vi.mocked(serverSupabaseClient).mockResolvedValue(
      createSupabaseMock([{ data: null, error: { message: 'lookup failed' } }])
        .client,
    )
    await expect(requireRole(event, 'operator')).rejects.toMatchObject({
      statusCode: 500,
    })
  })
})
