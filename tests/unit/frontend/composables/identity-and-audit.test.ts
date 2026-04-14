import { createPinia, setActivePinia } from 'pinia'
import { effectScope, nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuditTrail } from '@/app/composables/useAuditTrail'
import { useUsers } from '@/app/composables/useUsers'
import { useProfileSettings } from '@/app/composables/useProfileSettings'
import { useDeployments } from '@/app/composables/useDeployments'
import { useAuditStore } from '@/app/stores/audit'
import { useAuthStore } from '@/app/stores/auth'
import { useUsersStore } from '@/app/stores/users'
import { useProfileStore } from '@/app/stores/profile'
import { useDeploymentsStore } from '@/app/stores/deployments'
import { auditFixture } from '@/tests/helpers/audit-fixture'

const { showDialog } = vi.hoisted(() => ({ showDialog: vi.fn() }))
vi.mock('@/app/composables/useDialog', () => ({
  useDialog: () => ({ showDialog }),
}))
beforeEach(() => {
  setActivePinia(createPinia())
  showDialog.mockReset().mockResolvedValue({ confirmed: true })
})

describe('audit page sorting and loading', () => {
  it('sorts mapped rows in either direction and exposes the empty-state error', () => {
    const scope = effectScope()
    const store = useAuditStore()
    store.items = [
      { ...auditFixture, id: 'second', action: 'UPDATE' },
      { ...auditFixture, id: 'first', action: 'CREATE' },
    ]
    const page = scope.run(useAuditTrail)
    if (!page) throw new Error('Missing audit page')
    page.sortKey.value = 'action'
    page.sortDirection.value = 'asc'
    expect(page.tableRows.value.map((row) => row.id)).toEqual([
      'first',
      'second',
    ])
    page.sortDirection.value = 'desc'
    expect(page.tableRows.value.map((row) => row.id)).toEqual([
      'second',
      'first',
    ])
    expect(page.tableEmptyMessage.value).toBe('No audit log entries found.')
    store.error = 'Unavailable'
    expect(page.tableEmptyMessage.value).toBe('Unavailable')
    scope.stop()
  })

  it('copies filter inputs, watches pagination changes, and manages selected details', async () => {
    const scope = effectScope()
    const store = useAuditStore()
    const fetch = vi.spyOn(store, 'fetchAuditLogs').mockResolvedValue(undefined)
    const detail = vi
      .spyOn(store, 'fetchAuditLogById')
      .mockResolvedValue(auditFixture)
    const page = scope.run(useAuditTrail)
    if (!page) throw new Error('Missing audit page')
    const filters = { term: 'UPDATE' }
    await page.loadAuditLogs(1, filters, 5)
    expect(fetch).toHaveBeenCalledWith({ page: 1, pageSize: 5, term: 'UPDATE' })
    expect(page.filters.value).not.toBe(filters)
    store.page = 2
    await nextTick()
    expect(fetch).toHaveBeenLastCalledWith({
      page: 2,
      pageSize: store.pageSize,
      term: 'UPDATE',
    })
    await page.loadAuditLogById('audit')
    expect(detail).toHaveBeenCalledWith('audit')
    store.selectedAuditLog = auditFixture
    page.clearSelectedAuditLog()
    expect(page.selectedAuditLog.value).toBeNull()
    fetch.mockRejectedValue(new Error('Unavailable'))
    await expect(page.loadAuditLogs()).resolves.toBeUndefined()
    scope.stop()
  })
})

describe('user management presentation', () => {
  it('maps roles, account types, and privilege options with empty value fallbacks', () => {
    const store = useUsersStore()
    store.profileItems = [
      {
        id: 'user',
        fullName: 'Unit User',
        email: 'unit@example.test',
        isActive: false,
        lastLoginAt: null,
        accountTypeCodes: [],
      },
    ]
    store.accountItems = [
      {
        id: 'role',
        code: 'OPS',
        name: 'Operator',
        description: null,
        isSystem: false,
      },
    ]
    store.privilegeItems = [
      {
        id: 'permission',
        code: 'personnel.view',
        name: 'View personnel',
        module: 'personnel',
        isAssigned: false,
      },
    ]
    const page = useUsers()
    expect(page.profileTableRows.value[0]).toMatchObject({
      accountTypes: 'No account type',
      status: 'Inactive',
      lastLoginAt: 'Never',
    })
    expect(page.accountTableRows.value[0]?.systemType).toBe('Custom')
    expect(page.accountTypeOptions.value).toEqual([
      { value: 'role', label: 'Operator (OPS)' },
    ])
    expect(page.privilegeOptions.value).toEqual([
      {
        value: 'permission',
        code: 'personnel.view',
        name: 'View personnel',
        module: 'personnel',
      },
    ])
    store.profileItems = [
      {
        id: 'user',
        fullName: 'Unit User',
        email: 'unit@example.test',
        accountTypeCodes: ['OPS', 'ADMIN'],
        isActive: true,
        lastLoginAt: '2026-10-04',
      },
    ]
    expect(page.profileTableRows.value[0]).toMatchObject({
      accountTypes: 'OPS, ADMIN',
      status: 'Active',
      lastLoginAt: '2026-10-04',
    })
  })

  it('loads each tab with its own filters and tolerates errors exposed by the store', async () => {
    const store = useUsersStore()
    const profiles = vi
      .spyOn(store, 'fetchUserProfiles')
      .mockResolvedValue(undefined)
    const accounts = vi
      .spyOn(store, 'fetchUserAccounts')
      .mockResolvedValue(undefined)
    const privileges = vi
      .spyOn(store, 'fetchPrivileges')
      .mockResolvedValue(undefined)
    const page = useUsers()
    await page.loadUserProfiles(2, { term: 'User' }, 5)
    await page.loadUserAccounts(3, { term: 'Operator' }, 10)
    await page.loadPrivileges()
    expect(profiles).toHaveBeenCalledWith(2, { term: 'User' }, 5)
    expect(accounts).toHaveBeenCalledWith(3, { term: 'Operator' }, 10)
    expect(privileges).toHaveBeenCalledOnce()
    profiles.mockRejectedValue(new Error('Unavailable'))
    accounts.mockRejectedValue(new Error('Unavailable'))
    privileges.mockRejectedValue(new Error('Unavailable'))
    await expect(page.loadUserProfiles()).resolves.toBeUndefined()
    await expect(page.loadUserAccounts()).resolves.toBeUndefined()
    await expect(page.loadPrivileges()).resolves.toBeUndefined()
  })
})

describe('profile settings session identity', () => {
  it('saves through the current session user and refreshes that session afterward', async () => {
    const auth = useAuthStore()
    auth.currentUser = {
      id: 'user',
      fullName: 'Unit User',
      email: 'unit@example.test',
      accountTypeCodes: [],
      permissionCodes: [],
    }
    const store = useProfileStore()
    const save = vi.spyOn(store, 'saveDetails').mockResolvedValue(undefined)
    const refresh = vi.spyOn(auth, 'fetchSession').mockResolvedValue(undefined)
    const page = useProfileSettings()
    page.openSettings('email')
    expect(page.isOpen.value).toBe(true)
    expect(page.activeTab.value).toBe('email')
    page.setActiveTab('details')
    await page.onSaveDetails({ fullName: 'Changed' })
    expect(save).toHaveBeenCalledExactlyOnceWith('user', {
      fullName: 'Changed',
    })
    expect(refresh).toHaveBeenCalledOnce()
    page.closeSettings()
    expect(page.isOpen.value).toBe(false)
  })
})

describe('deployment update routing', () => {
  it('uses the location action when updating deployment coordinates', async () => {
    const store = useDeploymentsStore()
    const details = vi
      .spyOn(store, 'updateDeploymentDetails')
      .mockResolvedValue(undefined)
    const location = vi
      .spyOn(store, 'updateDeploymentLocation')
      .mockResolvedValue(undefined)
    const page = useDeployments()
    const payload = {
      deploymentArea: 'Manila',
      operationName: 'Mission',
      startDate: '2026-10-04',
      statusId: 'Active',
      deploymentAreaLatitude: 14.6,
      deploymentAreaLongitude: 121,
    }
    await page.updateDeploymentLocation('deployment', payload)
    expect(location).toHaveBeenCalledExactlyOnceWith('deployment', payload)
    expect(details).not.toHaveBeenCalled()
  })
})
