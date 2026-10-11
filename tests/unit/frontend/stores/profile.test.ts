import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useProfileStore } from '@/app/stores/profile'

describe('profile settings state and submissions', () => {
  const request = vi.fn()
  beforeEach(() => {
    setActivePinia(createPinia())
    request.mockReset()
    vi.stubGlobal('$fetch', request)
    vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
  })
  afterEach(() => vi.unstubAllGlobals())

  it('opens, changes tabs, and closes while clearing stale feedback', () => {
    const store = useProfileStore()
    store.error = 'old error'
    store.warning = 'old warning'
    store.openSettings()
    expect(store.isOpen).toBe(true)
    expect(store.activeTab).toBe('details')
    expect(store.error).toBe('')
    expect(store.warning).toBe('')
    store.setActiveTab('password')
    expect(store.isPasswordTab).toBe(true)
    store.closeSettings()
    expect(store.isOpen).toBe(false)
    store.openSettings('email')
    expect(store.activeTab).toBe('email')
  })

  const actions = [
    {
      name: 'details',
      path: '/api/users/user',
      run: (store: ReturnType<typeof useProfileStore>) =>
        store.saveDetails('user', { fullName: 'Test User' }),
      payload: { fullName: 'Test User' },
    },
    {
      name: 'email',
      path: '/api/users/user',
      run: (store: ReturnType<typeof useProfileStore>) =>
        store.saveEmail('user', { email: 'unit@example.test' }),
      payload: { email: 'unit@example.test' },
    },
    {
      name: 'other details',
      path: '/api/users/user',
      run: (store: ReturnType<typeof useProfileStore>) =>
        store.saveOtherDetails('user', { avatarUrl: null }),
      payload: { avatarUrl: null },
    },
    {
      name: 'password',
      path: '/api/users/user/password',
      run: (store: ReturnType<typeof useProfileStore>) =>
        store.savePassword('user', {
          currentPassword: 'old-password',
          newPassword: 'new-password',
        }),
      payload: { currentPassword: 'old-password', newPassword: 'new-password' },
    },
  ]

  describe.each(actions)('$name update', ({ path, run, payload }) => {
    it('submits through the endpoint and clears the submitting flag', async () => {
      const store = useProfileStore()
      request.mockResolvedValue({ ok: true })
      await run(store)
      expect(request).toHaveBeenCalledWith(
        path,
        expect.objectContaining({ method: 'PATCH', body: payload }),
      )
      expect(store.isSubmitting).toBe(false)
      expect(store.error).toBe('')
    })

    it('records the API error and resets the submitting flag', async () => {
      const store = useProfileStore()
      const error = Object.assign(new Error('failure'), {
        statusMessage: 'Update failed',
      })
      request.mockRejectedValue(error)
      await expect(run(store)).rejects.toBe(error)
      expect(store.error).toBe('Update failed')
      expect(store.isSubmitting).toBe(false)
    })
  })
})
