import type { H3Event } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getSessionToken: vi.fn(),
  getClient: vi.fn(),
  revokeSession: vi.fn(),
  recordAudit: vi.fn(),
  deleteCookie: vi.fn(),
}))

vi.mock('h3', async (importOriginal) => ({
  ...(await importOriginal<typeof import('h3')>()),
  deleteCookie: mocks.deleteCookie,
}))
vi.mock('../../../../server/shared/utils', () => ({
  getSessionTokenFromEvent: mocks.getSessionToken,
}))
vi.mock('../../../../server/utils/auth/serviceClient', () => ({
  getServiceSupabaseClient: mocks.getClient,
}))
vi.mock('../../../../server/utils/auth/revokeSessionByToken', () => ({
  revokeSessionByToken: mocks.revokeSession,
}))
vi.mock('../../../../server/utils/auth/recordAuthAuditLog', () => ({
  recordAuthAuditLog: mocks.recordAudit,
}))

import logout from '../../../../server/api/auth/logout.post'
import {
  AUDIT_LOG_OUTCOMES,
  SESSION_COOKIE_NAME,
} from '../../../../server/shared/constants'

const event = {} as H3Event

beforeEach(() => {
  vi.resetAllMocks()
  mocks.getSessionToken.mockReturnValue('session-token')
  mocks.getClient.mockReturnValue({})
  mocks.revokeSession.mockResolvedValue('user-1')
  mocks.recordAudit.mockResolvedValue(undefined)
})

describe('logout endpoint', () => {
  it('revokes a session, records its user, and clears the cookie', async () => {
    await expect(logout(event)).resolves.toEqual({ ok: true })

    expect(mocks.revokeSession).toHaveBeenCalledWith({}, 'session-token')
    expect(mocks.recordAudit).toHaveBeenCalledWith(
      event,
      expect.objectContaining({
        userId: 'user-1',
        statusCode: 200,
        responseData: { ok: true, outcome: AUDIT_LOG_OUTCOMES.success },
      }),
    )
    expect(mocks.deleteCookie).toHaveBeenCalledWith(
      event,
      SESSION_COOKIE_NAME,
      { path: '/' },
    )
  })

  it('clears the cookie without a database call when there is no token', async () => {
    mocks.getSessionToken.mockReturnValue(null)

    await expect(logout(event)).resolves.toEqual({ ok: true })
    expect(mocks.getClient).not.toHaveBeenCalled()
    expect(mocks.revokeSession).not.toHaveBeenCalled()
    expect(mocks.deleteCookie).toHaveBeenCalledWith(
      event,
      SESSION_COOKIE_NAME,
      { path: '/' },
    )
  })

  it('audits a failed revocation and still clears the cookie', async () => {
    const error = new Error('Write failed')
    mocks.revokeSession.mockRejectedValue(error)

    await expect(logout(event)).rejects.toBe(error)
    expect(mocks.recordAudit).toHaveBeenCalledWith(
      event,
      expect.objectContaining({
        statusCode: 500,
        responseData: {
          outcome: AUDIT_LOG_OUTCOMES.failed,
          message: 'Write failed',
        },
      }),
    )
    expect(mocks.deleteCookie).toHaveBeenCalledWith(
      event,
      SESSION_COOKIE_NAME,
      { path: '/' },
    )
  })

  it('audits database initialization failures and still clears the cookie', async () => {
    mocks.getClient.mockImplementation(() => {
      throw new Error('Database unavailable')
    })

    await expect(logout(event)).rejects.toThrow('Database unavailable')
    expect(mocks.recordAudit).toHaveBeenCalledWith(
      event,
      expect.objectContaining({
        responseData: {
          outcome: AUDIT_LOG_OUTCOMES.failed,
          message: 'Database unavailable',
        },
      }),
    )
    expect(mocks.deleteCookie).toHaveBeenCalled()
  })
})
