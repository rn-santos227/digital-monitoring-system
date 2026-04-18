import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { createLoadMoreCardsHandler } from '@/app/handlers/shared/load-more.handler'
import { createDeleteDialogCallbacks } from '@/app/handlers/shared/delete-feedback.handler'
import {
  createCurrentValuePrintHandler,
  createDetailPrintHandler,
  createTablePrintHandler,
} from '@/app/handlers/shared/print.handler'
import { printDetailRecord, printTableRecords } from '@/app/utils/print'

vi.mock('@/app/utils/print', () => ({
  printDetailRecord: vi.fn((item) => item),
  printTableRecords: vi.fn((items) => items),
}))

describe('shared card pagination handler', () => {
  const arrange = () => {
    const cardRows = ref([{ id: '1' }])
    const tableRows = ref([{ id: '2' }])
    const isLoading = ref(false)
    const canLoadMore = ref(true)
    const filters = ref({ search: 'radio' })
    const loadPage = vi.fn()
    const load = createLoadMoreCardsHandler({
      cardRows,
      tableRows,
      isLoading,
      canLoadMore,
      filters,
      loadPage,
      pagination: ref({ page: 1, pageSize: 10, totalPages: 2, totalItems: 12 }),
    })
    return { cardRows, isLoading, canLoadMore, loadPage, load }
  }

  it('loads the next page using current filters before appending results', async () => {
    const { load, loadPage, cardRows } = arrange()
    await load()
    expect(loadPage).toHaveBeenCalledExactlyOnceWith(2, { search: 'radio' }, 10)
    expect(cardRows.value).toEqual([{ id: '1' }, { id: '2' }])
  })

  it.each(['isLoading', 'canLoadMore'] as const)(
    'does not fetch while blocked by %s',
    async (flag) => {
      const context = arrange()
      context[flag].value = flag === 'isLoading'
      await context.load()
      expect(context.loadPage).not.toHaveBeenCalled()
      expect(context.cardRows.value).toEqual([{ id: '1' }])
    },
  )

  it('preserves existing cards if loading fails', async () => {
    const { load, loadPage, cardRows } = arrange()
    loadPage.mockRejectedValue(new Error('fetch failed'))
    await expect(load()).rejects.toThrow('fetch failed')
    expect(cardRows.value).toEqual([{ id: '1' }])
  })
})

describe('shared delete feedback', () => {
  it('refreshes data before success feedback and does not refresh after cancellation', async () => {
    const order: string[] = []
    const showDialog = vi.fn(async () => {
      order.push('dialog')
      return { confirmed: true }
    })
    const onRefresh = vi.fn(async () => {
      order.push('refresh')
    })
    const handlers = createDeleteDialogCallbacks({
      showDialog,
      onRefresh,
      successTitle: 'Deleted',
      successMessage: 'Done',
      cancelledMessage: 'Kept',
    })
    await handlers.onDeleteSuccess()
    expect(order).toEqual(['refresh', 'dialog'])
    await handlers.onDeleteCancelled()
    expect(onRefresh).toHaveBeenCalledOnce()
    expect(showDialog).toHaveBeenLastCalledWith({
      type: 'warning',
      title: 'Delete cancelled',
      message: 'Kept',
      confirmLabel: 'OK',
    })
  })
})

describe('shared print handlers', () => {
  it('prints the latest ref value', () => {
    const value = ref('first')
    const print = vi.fn((input) => input.toUpperCase())
    const handler = createCurrentValuePrintHandler(value, print)
    value.value = 'second'
    expect(handler()).toBe('SECOND')
  })

  it('delegates table and detail formats and rejects missing details', async () => {
    const format = {
      documentTitle: 'Personnel',
      filePrefix: 'personnel',
      columns: [],
    }
    const items = [{ id: '1' }]
    await expect(createTablePrintHandler(format)(items)).resolves.toBe(items)
    expect(printTableRecords).toHaveBeenCalledWith(items, format)
    const detailFormat = {
      documentTitle: 'Personnel',
      filePrefix: 'personnel',
      sections: [],
    }
    await expect(createDetailPrintHandler(detailFormat)(null)).rejects.toThrow(
      'Personnel is not available for printing.',
    )
    await expect(
      createDetailPrintHandler(detailFormat)(items[0] ?? {}),
    ).resolves.toEqual({ id: '1' })
    expect(printDetailRecord).toHaveBeenCalledWith({ id: '1' }, detailFormat)
  })
})
