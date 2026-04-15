import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'

import { usePagination } from '@/app/composables/usePagination'
import { useDateDisplay } from '@/app/composables/useDateDisplay'
import { useApplicationSettingsStore } from '@/app/stores/application-settings'
import { settingsFixture } from '@/tests/helpers/settings-fixture'

beforeEach(() => setActivePinia(createPinia()))

describe('reactive pagination', () => {
  it('updates available navigation and visible pages as inputs change', () => {
    const page = ref(1)
    const total = ref(1)
    const pagination = usePagination(page, total, ref(3))
    expect(pagination.hasPagination.value).toBe(false)
    expect(pagination.canGoPrevious.value).toBe(false)
    expect(pagination.canGoNext.value).toBe(false)
    total.value = 10
    page.value = 5
    expect(pagination.hasPagination.value).toBe(true)
    expect(pagination.canGoPrevious.value).toBe(true)
    expect(pagination.canGoNext.value).toBe(true)
    expect(pagination.visiblePages.value).toEqual([4, 5, 6])
    page.value = 10
    expect(pagination.canGoNext.value).toBe(false)
  })
})

describe('configured date display', () => {
  it.each([
    { pattern: 'yyyy-MM-dd', expected: '2026-10-04' },
    { pattern: 'MM/dd/yyyy', expected: '10/04/2026' },
    { pattern: 'dd/MM/yyyy', expected: '04/10/2026' },
    { pattern: 'dd-MM-yyyy', expected: '04-10-2026' },
    { pattern: 'MMMM d, yyyy', expected: 'October 4, 2026' },
    { pattern: 'EEE, MMM d, yyyy', expected: 'Sun, Oct 4, 2026' },
  ])('formats the $pattern setting', ({ pattern, expected }) => {
    const display = useDateDisplay()
    useApplicationSettingsStore().item = {
      ...settingsFixture,
      defaultDateFormat: pattern,
    }
    expect(display.formatDate('2026-10-04T12:00:00')).toBe(expected)
  })

  it('uses requested fallbacks for missing and invalid dates', () => {
    const display = useDateDisplay()
    expect(display.formatDate(null, 'Missing')).toBe('Missing')
    expect(display.formatDate('invalid', 'Invalid')).toBe('Invalid')
  })
})
