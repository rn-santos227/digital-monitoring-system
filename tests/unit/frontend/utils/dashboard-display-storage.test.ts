// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DASHBOARD_DISPLAY_STORAGE_KEY } from '@/app/constants/page.constants'
import { normalizeDashboardDisplay } from '@/app/utils/dashboard-display'
import { readDashboardDisplay, saveDashboardDisplay } from '@/app/utils/dashboard-display-storage'
import { readDashboardParameters } from '@/app/utils/dashboard-parameters-storage'

describe('dashboard display browser preferences', () => {
  beforeEach(() => {
    vi.stubGlobal('__TEST_NUXT_CLIENT__', true)
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('reloads choices independently for each signed-in account', () => {
    const first = normalizeDashboardDisplay({ kpis: ['deployed'], widgets: ['topKpis'] })
    const second = normalizeDashboardDisplay({ widgets: [] })
    expect(saveDashboardDisplay(first, 'official-1')).toBe(true)
    expect(saveDashboardDisplay(second, 'official-2')).toBe(true)
    expect(readDashboardDisplay('official-1')).toEqual(first)
    expect(readDashboardDisplay('official-2')).toEqual(second)
    expect(readDashboardDisplay('official-3').widgets).toHaveLength(9)
  })

  it('recovers safely from corrupt saved data', () => {
    localStorage.setItem(`${DASHBOARD_DISPLAY_STORAGE_KEY}:official-1`, '{invalid')
    expect(readDashboardDisplay('official-1')).toEqual(normalizeDashboardDisplay())
  })

  it('handles unavailable browser storage without breaking dashboard loading', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('Storage blocked') },
      setItem: () => { throw new Error('Storage blocked') },
    })
    expect(readDashboardDisplay('official-1')).toEqual(normalizeDashboardDisplay())
    expect(readDashboardParameters().personnelLimit).toBe(500)
    expect(saveDashboardDisplay(normalizeDashboardDisplay(), 'official-1')).toBe(false)
  })

  it('does not read or persist preferences for anonymous or server rendering', () => {
    const read = vi.spyOn(localStorage, 'getItem')
    const write = vi.spyOn(localStorage, 'setItem')
    expect(readDashboardDisplay('')).toEqual(normalizeDashboardDisplay())
    expect(saveDashboardDisplay(normalizeDashboardDisplay(), '')).toBe(false)
    vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
    expect(readDashboardDisplay('official-1')).toEqual(normalizeDashboardDisplay())
    expect(saveDashboardDisplay(normalizeDashboardDisplay(), 'official-1')).toBe(false)
    expect(read).not.toHaveBeenCalled()
    expect(write).not.toHaveBeenCalled()
  })
})
