// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  AUTH_HEADERS,
  AUTH_LOCAL_STORAGE_KEYS,
} from '@/app/constants/api.constants'
import {
  createSessionHeaders,
  getServerSessionHeaders,
  getStoredSessionToken,
  saveSessionToken,
} from '@/app/utils/auth-session'

describe('session token storage', () => {
  beforeEach(() => {
    vi.stubGlobal('__TEST_NUXT_CLIENT__', true)
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-04T00:00:00Z'))
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  const expiration = '2026-10-04T01:00:00Z'

  it('remembers a session in local storage and creates its request header', () => {
    saveSessionToken('token', expiration)
    expect(getStoredSessionToken()).toBe('token')
    expect(localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken)).toBe(
      'token',
    )
    expect(
      sessionStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken),
    ).toBeNull()
    expect(createSessionHeaders()).toEqual({
      [AUTH_HEADERS.sessionToken]: 'token',
    })
  })

  it('uses session storage when remember is off and clears older tokens', () => {
    saveSessionToken('remembered', expiration)
    saveSessionToken('temporary', expiration, false)
    expect(
      localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken),
    ).toBeNull()
    expect(getStoredSessionToken()).toBe('temporary')
  })

  it.each(['invalid', '2026-10-04T00:00:00Z', '2026-10-03T00:00:00Z', ''])(
    'rejects token expiration %s',
    (expiresAt) => {
      saveSessionToken('token', expiresAt)
      expect(getStoredSessionToken()).toBe('')
      expect(createSessionHeaders()).toEqual({})
    },
  )

  it('removes tokens that lack expiry metadata', () => {
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken, 'orphan')
    expect(getStoredSessionToken()).toBe('')
    expect(
      localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken),
    ).toBeNull()
  })

  it('expires a stored token and preserves a newer session from an older timer', () => {
    saveSessionToken('first', '2026-10-04T00:01:00Z')
    saveSessionToken('second', '2026-10-04T00:02:00Z')
    vi.advanceTimersByTime(60000)
    expect(getStoredSessionToken()).toBe('second')
    vi.advanceTimersByTime(60000)
    expect(getStoredSessionToken()).toBe('')
  })

  it('clears both storage targets when signing out', () => {
    saveSessionToken('token', expiration)
    saveSessionToken()
    expect(getStoredSessionToken()).toBe('')
  })

  it('uses only cookie headers during SSR and never touches browser storage', () => {
    saveSessionToken('browser', expiration)
    vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
    vi.stubGlobal(
      'useRequestHeaders',
      vi.fn().mockReturnValue({ cookie: ' session=cookie ' }),
    )
    expect(getStoredSessionToken()).toBe('')
    expect(getServerSessionHeaders()).toEqual({ cookie: 'session=cookie' })
    saveSessionToken()
    expect(localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken)).toBe(
      'browser',
    )
    vi.stubGlobal('useRequestHeaders', vi.fn().mockReturnValue({}))
    expect(getServerSessionHeaders()).toEqual({})
    vi.stubGlobal('__TEST_NUXT_CLIENT__', true)
    expect(getServerSessionHeaders()).toEqual({})
  })
})
