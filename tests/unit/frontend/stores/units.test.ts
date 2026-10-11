import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useUnitManagementKpisStore } from '@/app/stores/units'

describe('unit management KPI cache', () => {
  const request = vi.fn()
  beforeEach(() => {
    setActivePinia(createPinia())
    request.mockReset()
    vi.stubGlobal('$fetch', request)
    vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
  })
  afterEach(() => vi.unstubAllGlobals())

  it('loads once and applies nonnegative deltas only to loaded counts', async () => {
    const store = useUnitManagementKpisStore()
    store.applyBattalionKpiDelta(1)
    store.applyCompanyKpiDelta(1)
    store.applyUnassignedPersonnelKpiDelta(1)
    expect(store.kpis.totalBattalions).toBe(0)
    request.mockResolvedValue({
      totalBattalions: 0,
      totalCompanies: 0,
      totalUnassignedPersonnel: 0,
    })
    await store.fetchUnitManagementKpisOnce()
    await store.fetchUnitManagementKpisOnce()
    expect(request).toHaveBeenCalledTimes(1)
    for (const delta of [-1, 1] as const) {
      store.applyBattalionKpiDelta(delta)
      store.applyCompanyKpiDelta(delta)
      store.applyUnassignedPersonnelKpiDelta(delta)
    }
    expect(store.unitManagementKpis).toEqual({
      totalBattalions: 1,
      totalCompanies: 1,
      totalUnassignedPersonnel: 1,
    })
  })

  it('resets failed loads and allows retrying', async () => {
    const store = useUnitManagementKpisStore()
    request.mockRejectedValue(
      Object.assign(new Error('failed'), { statusMessage: 'KPI load failed' }),
    )
    await expect(store.fetchUnitManagementKpisOnce()).rejects.toThrow('failed')
    expect(store.error).toBe('KPI load failed')
    expect(store.hasLoadedKpis).toBe(false)
    expect(store.isLoading).toBe(false)
  })
})
