import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useRanksStore } from '@/app/stores/ranks'
import { usePersonnelStore } from '@/app/stores/personnel'

const rank = {
  id: 'rank',
  code: 'SGT',
  name: 'Sergeant',
  sortOrder: 1,
  createdAt: 'created',
  updatedAt: 'updated',
}

describe('rank collection and personnel KPIs', () => {
  const request = vi.fn()
  beforeEach(() => {
    setActivePinia(createPinia())
    request.mockReset()
    vi.stubGlobal('$fetch', request)
    vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
  })
  afterEach(() => vi.unstubAllGlobals())

  it.each([false, true])(
    'loads rank lists with advanced filters = %s',
    async (advanced) => {
      const store = useRanksStore()
      request.mockResolvedValue({
        items: [rank],
        page: 2,
        pageSize: 5,
        totalItems: 6,
        totalPages: 2,
      })
      await store.fetchRanks(
        2,
        advanced ? { term: 'Sergeant', conditions: '[]' } : {},
        5,
      )
      expect(store.items).toEqual([rank])
      expect(store.hasRankItems).toBe(true)
      expect(store.pagination).toEqual({
        page: 2,
        pageSize: 5,
        totalItems: 6,
        totalPages: 2,
      })
      expect(store.isLoading).toBe(false)
      expect(request).toHaveBeenCalledWith(
        advanced ? '/api/ranks/search' : '/api/ranks',
        expect.objectContaining({ method: 'GET' }),
      )
    },
  )

  it.each(['', 'Sergeant', 'other'])(
    'appends a created rank only when it matches search %s',
    async (search) => {
      const store = useRanksStore()
      store.searchTerm = search
      const personnel = usePersonnelStore()
      personnel.hasLoadedKpis = true
      request.mockResolvedValue({ ok: true, id: rank.id, item: rank })
      await store.createRank({ code: 'SGT', name: 'Sergeant', sortOrder: 1 })
      expect(store.items).toEqual(search === 'other' ? [] : [rank])
      expect(personnel.kpis.totalRanks).toBe(1)
      expect(store.isLoading).toBe(false)
    },
  )

  it('removes visible ranks and never reduces pagination totals below zero', async () => {
    const store = useRanksStore()
    store.items = [rank]
    store.pagination.totalItems = 1
    request.mockResolvedValue({ ok: true })
    await store.deleteRank('rank')
    await store.deleteRank('missing')
    expect(store.items).toEqual([])
    expect(store.pagination.totalItems).toBe(0)
    expect(store.isLoading).toBe(false)
  })

  it('records load and mutation failures and clears busy state', async () => {
    const store = useRanksStore()
    request.mockRejectedValue(
      Object.assign(new Error('failed'), {
        statusMessage: 'Rank request rejected',
      }),
    )
    await expect(store.fetchRanks()).rejects.toThrow('failed')
    await expect(
      store.createRank({ code: 'SGT', name: 'Sergeant', sortOrder: 1 }),
    ).rejects.toThrow('failed')
    await expect(store.deleteRank('rank')).rejects.toThrow('failed')
    expect(store.error).toBe('Rank request rejected')
    expect(store.isLoading).toBe(false)
    expect(store.pagination.totalItems).toBe(0)
  })
})
