import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useUsersStore } from '@/app/stores/users'

const account = {
  id: 'account',
  code: 'operator',
  name: 'Operator',
  description: null,
  isSystem: false,
}
const profile = {
  id: 'user',
  email: 'unit@example.test',
  fullName: 'Unit User',
  isActive: true,
  lastLoginAt: null,
  accountTypeCodes: ['operator'],
}
const permission = {
  id: 'permission',
  code: 'personnel.view',
  name: 'View personnel',
  module: 'personnel',
  isAssigned: true,
}

describe('user management store', () => {
  const request = vi.fn()
  beforeEach(() => {
    setActivePinia(createPinia())
    request.mockReset()
    vi.stubGlobal('$fetch', request)
    vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
  })
  afterEach(() => vi.unstubAllGlobals())

  it.each([false, true])(
    'loads profile and account tables with searching = %s',
    async (searching) => {
      const store = useUsersStore()
      const filters = searching
        ? { term: ' Unit ', conditions: '[]', isActive: false }
        : {}
      request.mockResolvedValue({
        items: [{ ...profile, accountTypes: [account] }],
        page: 2,
        pageSize: 5,
        totalItems: 7,
        totalPages: 2,
      })
      await store.fetchUserProfiles(2, filters, 5)
      expect(store.profileItems).toEqual([profile])
      expect(store.hasUserProfiles).toBe(true)
      expect(store.profilePagination.totalItems).toBe(7)
      request.mockResolvedValue({
        items: [account],
        page: 2,
        pageSize: 5,
        totalItems: 7,
        totalPages: 2,
      })
      await store.fetchUserAccounts(2, searching ? { term: 'Operator' } : {}, 5)
      expect(store.accountItems).toEqual([account])
      expect(store.hasUserAccounts).toBe(true)
      expect(store.isLoading).toBe(false)
    },
  )

  it('resets stale tables and flags when listing fails', async () => {
    const store = useUsersStore()
    store.profileItems = [profile]
    store.accountItems = [account]
    request.mockRejectedValue(
      Object.assign(new Error('failed'), { statusMessage: 'List failed' }),
    )
    await expect(store.fetchUserProfiles()).rejects.toThrow('failed')
    await expect(store.fetchUserAccounts()).rejects.toThrow('failed')
    expect(store.profileItems).toEqual([])
    expect(store.accountItems).toEqual([])
    expect(store.profilePagination.totalItems).toBe(0)
    expect(store.accountPagination.totalItems).toBe(0)
    expect(store.error).toBe('List failed')
    expect(store.isLoading).toBe(false)
  })

  it('loads KPI counts once and retries after failure', async () => {
    const store = useUsersStore()
    request.mockRejectedValue(new Error('failed'))
    await expect(store.fetchUserManagementKpisOnce()).rejects.toThrow('failed')
    expect(store.hasLoadedKpis).toBe(false)
    request.mockResolvedValue({
      activeUsers: 1,
      inactiveUsers: 0,
      totalAccountTypes: 2,
      unusedAccountTypes: 1,
    })
    await store.fetchUserManagementKpisOnce()
    await store.fetchUserManagementKpisOnce()
    expect(store.userManagementKpis.activeUsers).toBe(1)
    expect(request).toHaveBeenCalledTimes(2)
  })

  it.each([false, true])(
    'creates profiles and account types with KPI cache loaded = %s',
    async (loaded) => {
      const store = useUsersStore()
      store.hasLoadedKpis = loaded
      store.accountItems = [account]
      store.kpis.unusedAccountTypes = 1
      request.mockResolvedValue({ id: 'created' })
      await store.createUserProfile({
        personnelId: null,
        email: 'new@example.test',
        fullName: 'New User',
        avatarUrl: null,
        password: 'password123',
        accountTypeIds: ['account', 'missing'],
      })
      expect(store.profileItems[0]).toMatchObject({
        id: 'created',
        accountTypeCodes: ['operator'],
        isActive: true,
      })
      expect(store.profilePagination.totalItems).toBe(1)
      expect(store.kpis.activeUsers).toBe(loaded ? 1 : 0)
      await store.createAccountType({
        code: 'new',
        name: 'New',
        description: null,
        isSystem: false,
        permissionIds: [],
      })
      expect(store.accountItems[0]).toMatchObject({
        id: 'created',
        code: 'new',
      })
      expect(store.accountPagination.totalItems).toBe(1)
      expect(store.kpis.totalAccountTypes).toBe(loaded ? 1 : 0)
    },
  )

  it('leaves state unchanged if create endpoints return no id', async () => {
    const store = useUsersStore()
    request.mockResolvedValue({ id: null })
    await store.createAccountType({
      code: 'new',
      name: 'New',
      description: null,
      isSystem: false,
      permissionIds: [],
    })
    expect(store.accountItems).toEqual([])
    expect(store.accountPagination.totalItems).toBe(0)
  })

  it('maps detail access ids and privileges while retaining view metadata', async () => {
    const store = useUsersStore()
    request.mockResolvedValue({ ...account, permissions: [permission] })
    expect(await store.getAccountTypeById('account')).toMatchObject({
      permissionIds: ['permission'],
    })
    request.mockResolvedValue({
      ...profile,
      personnelId: 'person',
      avatarUrl: null,
      accountTypes: [account],
      createdAt: 'created',
      updatedAt: 'updated',
      passwordUpdatedAt: null,
    })
    expect(await store.getUserProfileById('user')).toMatchObject({
      accountTypeIds: ['account'],
    })
    expect(await store.getUserProfileViewById('user')).toMatchObject({
      createdAt: 'created',
      accountTypes: [{ id: 'account', code: 'operator', name: 'Operator' }],
    })
    request.mockResolvedValue({ items: [permission] })
    await store.fetchPrivileges()
    expect(store.privilegeItems).toEqual([permission])
    expect(store.hasPrivileges).toBe(true)
  })

  it('updates selected rows and keeps untouched profiles intact', async () => {
    const store = useUsersStore()
    store.profileItems = [profile, { ...profile, id: 'other' }]
    store.accountItems = [account, { ...account, id: 'other-account' }]
    request.mockResolvedValue({ ok: true })
    await store.updateUserProfile('user', {
      fullName: 'Changed',
      accountTypeIds: ['account', 'missing'],
    })
    expect(store.profileItems[0]).toMatchObject({
      fullName: 'Changed',
      accountTypeCodes: ['operator'],
    })
    expect(store.profileItems[1]).toEqual({ ...profile, id: 'other' })
    await store.updateUserProfile('user', {})
    expect(store.profileItems[0]?.accountTypeCodes).toEqual(['operator'])
    await store.updateAccountType('account', {
      code: 'new',
      name: 'New',
      description: 'Changed',
      isSystem: false,
      permissionIds: [],
    })
    expect(store.accountItems[0]?.name).toBe('New')
    expect(store.accountItems[1]?.name).toBe('Operator')
    await store.updateUserPassword('user', { newPassword: 'password123' })
  })

  it.each([false, true])(
    'updates activation totals and deletes rows with KPI cache loaded = %s',
    async (loaded) => {
      const store = useUsersStore()
      store.hasLoadedKpis = loaded
      store.profileItems = [profile]
      store.accountItems = [account]
      store.profilePagination.totalItems = 1
      store.accountPagination.totalItems = 1
      store.kpis.activeUsers = 1
      store.kpis.totalAccountTypes = 1
      request.mockResolvedValue({ ok: true })
      await store.updateUserActivation('user', { isActive: false })
      expect(store.profileItems[0]?.isActive).toBe(false)
      expect(store.kpis.inactiveUsers).toBe(loaded ? 1 : 0)
      await store.deleteUserProfile('user')
      await store.deleteAccountType('account')
      expect(store.profilePagination.totalItems).toBe(0)
      expect(store.accountPagination.totalItems).toBe(0)
      expect(store.profileItems).toEqual([])
      expect(store.accountItems).toEqual([])
      expect(store.kpis.inactiveUsers).toBe(0)
    },
  )

  it('records errors for failed mutations and detail lookups without replacing existing data', async () => {
    const store = useUsersStore()
    store.profileItems = [profile]
    store.accountItems = [account]
    request.mockRejectedValue(
      Object.assign(new Error('failed'), { statusMessage: 'Request rejected' }),
    )
    const actions = [
      () =>
        store.createUserProfile({
          email: 'new@example.test',
          fullName: 'New',
          avatarUrl: null,
          personnelId: null,
          password: 'password123',
          accountTypeIds: [],
        }),
      () =>
        store.createAccountType({
          code: 'new',
          name: 'New',
          description: null,
          isSystem: false,
          permissionIds: [],
        }),
      () => store.getAccountTypeById('account'),
      () => store.getUserProfileById('user'),
      () => store.getUserProfileViewById('user'),
      () => store.updateUserProfile('user', {}),
      () => store.updateUserPassword('user', { newPassword: 'password123' }),
      () => store.updateUserActivation('user', { isActive: false }),
      () => store.deleteUserProfile('user'),
      () =>
        store.updateAccountType('account', { ...account, permissionIds: [] }),
      () => store.deleteAccountType('account'),
      () => store.fetchPrivileges(),
    ]
    for (const action of actions) {
      await expect(action()).rejects.toThrow('failed')
      expect(store.error).toBe('Request rejected')
    }
    expect(store.profileItems).toEqual([profile])
    expect(store.accountItems).toEqual([account])
    expect(store.privilegeItems).toEqual([])
  })
})
