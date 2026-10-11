import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/app/stores/auth'
import {
  getSessionEndpoint,
  loginWithPasswordEndpoint,
  logoutEndpoint,
} from '@/app/utils/auth-endpoints'

vi.mock('@/app/utils/auth-endpoints', () => ({
  getSessionEndpoint: vi.fn(),
  loginWithPasswordEndpoint: vi.fn(),
  logoutEndpoint: vi.fn(),
}))

const user = {
  id: 'user',
  email: 'unit@example.test',
  fullName: 'Unit User',
  accountTypeCodes: ['operator'],
  permissionCodes: ['personnel.view', 'equipment.view'],
}

describe('authentication store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('applies all/any privilege checks and role checks for the current session', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.accountTypeCodes).toEqual([])
    expect(store.permissionCodes).toEqual([])
    store.currentUser = user
    expect(store.isAuthenticated).toBe(true)
    expect(store.hasRole('operator')).toBe(true)
    expect(store.hasRole('admin')).toBe(false)
    expect(store.hasPermission('personnel.delete')).toBe(false)
    expect(store.hasPermissionAccess()).toBe(true)
    expect(store.hasPermissionAccess([])).toBe(true)
    expect(
      store.hasPermissionAccess(['personnel.view', 'equipment.view']),
    ).toBe(true)
    expect(
      store.hasPermissionAccess(['personnel.view', 'personnel.delete']),
    ).toBe(false)
    expect(store.hasAnyPermissionAccess()).toBe(true)
    expect(store.hasAnyPermissionAccess([])).toBe(true)
    expect(
      store.hasAnyPermissionAccess(['personnel.delete', 'personnel.view']),
    ).toBe(true)
    expect(store.hasAnyPermissionAccess(['personnel.delete'])).toBe(false)
  })

  it('records a successful login and clears submitting state', async () => {
    const store = useAuthStore()
    vi.mocked(loginWithPasswordEndpoint).mockResolvedValue({ ok: true, user })
    const payload = { email: user.email, password: 'test-password' }
    await store.login(payload)
    expect(loginWithPasswordEndpoint).toHaveBeenCalledWith(payload)
    expect(store.currentUser).toEqual(user)
    expect(store.hasCheckedSession).toBe(true)
    expect(store.isSubmitting).toBe(false)
  })

  it('retains actionable login errors and clears submitting after failure', async () => {
    const store = useAuthStore()
    const error = Object.assign(new Error('private'), {
      statusMessage: 'Invalid credentials',
    })
    vi.mocked(loginWithPasswordEndpoint).mockRejectedValue(error)
    await expect(
      store.login({ email: user.email, password: 'wrong' }),
    ).rejects.toBe(error)
    expect(store.loginError).toBe('Invalid credentials')
    expect(store.currentUser).toBeNull()
    expect(store.isSubmitting).toBe(false)
  })

  it('checks the session and clears stale authentication if the request fails', async () => {
    const store = useAuthStore()
    vi.mocked(getSessionEndpoint).mockResolvedValue({ ok: true, user })
    await store.fetchSession()
    expect(store.currentUser).toEqual(user)
    vi.mocked(getSessionEndpoint).mockRejectedValue(new Error('expired'))
    await store.fetchSession()
    expect(store.currentUser).toBeNull()
    expect(store.hasCheckedSession).toBe(true)
    expect(store.isCheckingSession).toBe(false)
  })

  it('clears the session on successful logout and preserves it when logout fails', async () => {
    const store = useAuthStore()
    store.currentUser = user
    vi.mocked(logoutEndpoint).mockRejectedValueOnce(new Error('offline'))
    await expect(store.logout()).rejects.toThrow('offline')
    expect(store.currentUser).toEqual(user)
    expect(store.isLoggingOut).toBe(false)
    vi.mocked(logoutEndpoint).mockResolvedValue({ ok: true })
    await store.logout()
    expect(store.currentUser).toBeNull()
  })
})
