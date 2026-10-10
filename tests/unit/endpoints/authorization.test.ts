import type { H3Event } from 'h3'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SESSION_TOKEN_HEADER_NAME } from '@/server/shared/constants'

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  requirePermission: vi.fn(),
  requireAnyPermission: vi.fn(),
  requireBulkPermission: vi.fn(),
  serviceClient: vi.fn(),
  audit: vi.fn(),
}))

vi.mock('@/server/utils/auth/requireAuth', () => ({
  requireAuth: mocks.requireAuth,
}))
vi.mock('@/server/utils/auth/requirePermission', () => ({
  requirePermission: mocks.requirePermission,
}))
vi.mock('@/server/utils/auth/requireAnyPermission', () => ({
  requireAnyPermission: mocks.requireAnyPermission,
}))
vi.mock('@/server/utils/bulk/requireBulkPermission', () => ({
  requireBulkPermission: mocks.requireBulkPermission,
}))
vi.mock('@/server/utils/auth/serviceClient', () => ({
  getServiceSupabaseClient: mocks.serviceClient,
  getPublicSupabaseClient: mocks.serviceClient,
}))
vi.mock('@/server/utils/audit/recordManagementAuditLog', () => ({
  recordManagementAuditLog: mocks.audit,
}))
vi.mock('@/server/utils/audit/recordApiAuditLog', () => ({
  recordApiAuditLog: mocks.audit,
}))
vi.mock('h3', async (importOriginal) => {
  const original = await importOriginal<typeof import('h3')>()
  return {
    ...original,
    getRouterParam: (_event: H3Event, key: string) =>
      key === 'domain' ? 'battalions' : 'record-id',
    readBody: vi.fn(async () => ({
      ids: ['record-id'],
      items: [{ id: 'record-id', updates: { name: 'Test' } }],
    })),
  }
})

type EndpointHandler = (event: H3Event) => unknown
const endpoints = import.meta.glob<{ default: EndpointHandler }>(
  '/server/api/**/*.ts',
)
const publicEndpoints = new Set([
  '/server/api/auth/login.post.ts',
  '/server/api/auth/logout.post.ts',
  '/server/api/application-settings/index.get.ts',
])
const protectedEndpoints = Object.entries(endpoints).filter(
  ([path]) => !publicEndpoints.has(path),
)

describe.each(protectedEndpoints)('%s access boundary', (_path, load) => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal('defineEventHandler', (handler: EndpointHandler) => handler)
    vi.stubGlobal('useRuntimeConfig', () => ({ public: {} }))
  })

  afterEach(() => vi.unstubAllGlobals())

  it.each([401, 403])(
    'propagates access denial %s before opening a privileged database client',
    async (statusCode) => {
      const denied = Object.assign(new Error('Access denied'), { statusCode })
      mocks.requireAuth.mockRejectedValue(denied)
      mocks.requirePermission.mockRejectedValue(denied)
      mocks.requireAnyPermission.mockRejectedValue(denied)
      mocks.requireBulkPermission.mockRejectedValue(denied)
      const { default: handler } = await load()
      const event = {
        context: {},
        node: {
          req: {
            headers: { [SESSION_TOKEN_HEADER_NAME]: 'unit-session' },
            socket: {},
          },
        },
      } as H3Event
      await expect(handler(event)).rejects.toBe(denied)
      expect(
        mocks.requireAuth.mock.calls.length +
          mocks.requirePermission.mock.calls.length +
          mocks.requireAnyPermission.mock.calls.length +
          mocks.requireBulkPermission.mock.calls.length,
      ).toBeGreaterThan(0)
      expect(mocks.serviceClient).not.toHaveBeenCalled()
    },
    20_000,
  )
})
