import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRanks } from '@/app/composables/useRanks'
import { useLoginForm } from '@/app/composables/useLogin'
import { useAuthStore } from '@/app/stores/auth'
import { useRanksStore } from '@/app/stores/ranks'

beforeEach(() => setActivePinia(createPinia()))

describe('rank page orchestration', () => {
  it('creates a rank exactly once and returns the result', async () => {
    const store = useRanksStore()
    const item = {
      id: 'rank',
      code: 'SGT',
      name: 'Sergeant',
      sortOrder: 1,
      createdAt: 'created',
      updatedAt: 'updated',
    }
    const create = vi
      .spyOn(store, 'createRank')
      .mockResolvedValue({ ok: true, id: item.id, item })
    const page = useRanks()
    const payload = { code: 'SGT', name: 'Sergeant', sortOrder: 1 }
    await expect(page.createRank(payload)).resolves.toEqual({
      ok: true,
      id: item.id,
      item,
    })
    expect(create).toHaveBeenCalledExactlyOnceWith(payload)
    const remove = vi.spyOn(store, 'deleteRank').mockResolvedValue({ ok: true })
    await page.deleteRank('rank')
    expect(remove).toHaveBeenCalledExactlyOnceWith('rank')
  })

  it('copies filters and exposes store loading, pagination, and error state', async () => {
    const store = useRanksStore()
    const fetch = vi.spyOn(store, 'fetchRanks').mockResolvedValue()
    const page = useRanks()
    const filters = { term: ' Sergeant ' }
    await page.loadRanks(2, filters, 5)
    expect(fetch).toHaveBeenCalledWith(2, filters, 5)
    expect(page.filters.value).toEqual(filters)
    expect(page.filters.value).not.toBe(filters)
    fetch.mockRejectedValue(new Error('failed'))
    await expect(page.loadRanks()).resolves.toBeUndefined()
    expect(page.totalItems.value).toBe(0)
    expect(page.tableRows.value).toEqual([])
  })
})

describe('login form state', () => {
  it('validates credentials and disables submission while a request is running', () => {
    const form = useLoginForm()
    expect(form.isSubmitDisabled.value).toBe(true)
    expect(form.validateForm()).toBe(false)
    expect(form.formErrors.email).toBeTruthy()
    expect(form.formErrors.password).toBeTruthy()
    Object.assign(form.formState, {
      email: ' unit@example.test ',
      password: ' password123 ',
    })
    expect(form.validateForm()).toBe(true)
    expect(form.formState.email).toBe('unit@example.test')
    expect(form.formState.password).toBe('password123')
    expect(form.isSubmitDisabled.value).toBe(false)
    useAuthStore().isSubmitting = true
    expect(form.isSubmitDisabled.value).toBe(true)
  })
})
