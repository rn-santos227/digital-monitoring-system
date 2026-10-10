import { createPinia, setActivePinia, type StoreGeneric } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

interface CollectionState {
  items: Array<Record<string, unknown>>
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
  isLoading: boolean
  error: string
}

interface StoreCollectionContract {
  name: string
  useStore: () => StoreGeneric
  section?: string
  fetchAction: string
  createAction: string
  deleteAction: string
  updateActions?: string[]
  listPath: string
  row: Record<string, unknown> & { id: string }
  payload: Record<string, unknown>
  updatePayload?: Record<string, unknown>
  listThrows?: boolean
  decrementUnlisted?: boolean
}

export const defineStoreCollectionTests = ({
  name,
  useStore,
  section,
  fetchAction,
  createAction,
  deleteAction,
  updateActions = [],
  listPath,
  row,
  payload,
  updatePayload = { remarks: 'Updated' },
  listThrows = true,
  decrementUnlisted = false,
}: StoreCollectionContract) => {
  describe(`${name} collection state`, () => {
    const fetchMock = vi.fn()
    const collection = (store: StoreGeneric): CollectionState =>
      section
        ? (store.$state[section] as CollectionState)
        : (store.$state as CollectionState)
    const call = (store: StoreGeneric, action: string, ...args: unknown[]) => {
      const handler = store[action] as
        | ((...values: unknown[]) => Promise<unknown>)
        | undefined
      if (!handler) throw new Error(`Missing store action: ${action}`)
      return handler(...args)
    }
    const listResponse = () => ({
      items: [{ ...row }],
      page: 2,
      pageSize: 5,
      totalItems: 6,
      totalPages: 2,
    })
    const seed = (store: StoreGeneric) => {
      const state = collection(store)
      state.items = [{ ...row }, { ...row, id: 'other' }]
      state.pagination = { page: 1, pageSize: 10, totalItems: 2, totalPages: 1 }
      return state
    }

    beforeEach(() => {
      setActivePinia(createPinia())
      fetchMock.mockReset()
      vi.stubGlobal('$fetch', fetchMock)
      vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
    })

    afterEach(() => vi.unstubAllGlobals())

    it('keeps state independent across Pinia instances', () => {
      const first = useStore()
      seed(first)
      setActivePinia(createPinia())
      const second = useStore()
      expect(collection(second).items).toEqual([])
      expect(collection(second).pagination.totalItems).toBe(0)
    })

    it.each([false, true])(
      'loads pagination and rows with search enabled = %s',
      async (searching) => {
        const store = useStore()
        fetchMock.mockResolvedValue(listResponse())
        await call(
          store,
          fetchAction,
          2,
          searching ? { term: 'Test', conditions: '[]', match: 'any' } : {},
          5,
        )
        const state = collection(store)
        expect(state.items.map((item) => item.id)).toEqual([row.id])
        expect(state.pagination).toEqual({
          page: 2,
          pageSize: 5,
          totalItems: 6,
          totalPages: 2,
        })
        expect(state.isLoading).toBe(false)
        expect(state.error).toBe('')
        expect(fetchMock).toHaveBeenCalledWith(
          searching ? `${listPath}/search` : listPath,
          expect.objectContaining({
            method: 'GET',
            query: expect.objectContaining({ page: 2, pageSize: 5 }),
          }),
        )
      },
    )

    it('clears stale rows and loading state while recording list failure', async () => {
      const store = useStore()
      const state = seed(store)
      const error = Object.assign(new Error('private detail'), {
        statusMessage: 'Test request failed',
      })
      fetchMock.mockRejectedValue(error)
      const result = call(store, fetchAction)
      if (listThrows) await expect(result).rejects.toBe(error)
      else await result
      expect(state.items).toEqual([])
      expect(state.pagination.page).toBe(1)
      expect(state.pagination.totalItems).toBe(0)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe('Test request failed')
    })

    it.each([false, true])(
      'appends created API data and updates totals with KPIs loaded = %s',
      async (loaded) => {
        const store = useStore()
        store.hasLoadedKpis = loaded
        fetchMock.mockResolvedValue({ ok: true, id: row.id, item: { ...row } })
        await call(store, createAction, payload)
        const state = collection(store)
        expect(state.items).toContainEqual(row)
        expect(state.pagination.totalItems).toBe(1)
        expect(state.pagination.totalPages).toBe(1)
        expect(fetchMock).toHaveBeenCalledWith(
          listPath,
          expect.objectContaining({ method: 'POST', body: payload }),
        )
      },
    )

    it('preserves rows and pagination after a failed create', async () => {
      const store = useStore()
      const state = seed(store)
      const error = Object.assign(new Error('create failed'), {
        statusMessage: 'Test request failed',
      })
      fetchMock.mockRejectedValue(error)
      await expect(call(store, createAction, payload)).rejects.toBe(error)
      expect(state.items.map((item) => item.id)).toEqual([row.id, 'other'])
      expect(state.pagination.totalItems).toBe(2)
      expect(state.error).toBe('Test request failed')
    })

    it.each([false, true])(
      'removes the selected row with KPIs loaded = %s',
      async (loaded) => {
        const store = useStore()
        store.hasLoadedKpis = loaded
        const state = seed(store)
        fetchMock.mockResolvedValue({ ok: true })
        await call(store, deleteAction, row.id)
        expect(state.items.map((item) => item.id)).toEqual(['other'])
        expect(state.pagination.totalItems).toBe(1)
        expect(fetchMock).toHaveBeenCalledWith(
          `${listPath}/${row.id}`,
          expect.objectContaining({ method: 'DELETE' }),
        )
        await call(store, deleteAction, 'other')
        expect(state.pagination.totalItems).toBe(0)
        expect(state.pagination.totalPages).toBe(0)
      },
    )

    it('preserves visible rows when a successfully deleted id is outside the current page', async () => {
      const store = useStore()
      const state = seed(store)
      fetchMock.mockResolvedValue({ ok: true })
      await call(store, deleteAction, 'missing')
      expect(state.items).toHaveLength(2)
      expect(state.pagination.totalItems).toBe(decrementUnlisted ? 1 : 2)
    })

    it('preserves data when deletion fails', async () => {
      const store = useStore()
      const state = seed(store)
      fetchMock.mockRejectedValue(
        Object.assign(new Error('used'), {
          statusMessage: 'Test request failed',
        }),
      )
      await expect(call(store, deleteAction, row.id)).rejects.toThrow('used')
      expect(state.items).toHaveLength(2)
      expect(state.pagination.totalItems).toBe(2)
      expect(state.error).toBe('Test request failed')
    })

    describe.each(updateActions)('%s', (action) => {
      it('updates the selected row while preserving other rows', async () => {
        const store = useStore()
        const state = seed(store)
        const updatedRow = { ...row, ...updatePayload }
        fetchMock.mockResolvedValue({
          ...updatedRow,
          ok: true,
          item: updatedRow,
        })
        await call(store, action, row.id, updatePayload)
        expect(state.items.find((item) => item.id === row.id)).toMatchObject(
          updatePayload,
        )
        expect(state.items.find((item) => item.id === 'other')).toEqual({
          ...row,
          id: 'other',
        })
        expect(state.pagination.totalItems).toBe(2)
      })

      it('keeps the existing row and records an update failure', async () => {
        const store = useStore()
        const state = seed(store)
        fetchMock.mockRejectedValue(
          Object.assign(new Error('failed'), {
            statusMessage: 'Test request failed',
          }),
        )
        await expect(
          call(store, action, row.id, updatePayload),
        ).rejects.toThrow('failed')
        expect(state.items.find((item) => item.id === row.id)).toEqual(row)
        expect(state.error).toBe('Test request failed')
      })
    })
  })
}
