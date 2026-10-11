import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { extractApiErrorMessage, withApiLoading } from '@/app/utils/api-request'
import { useLoadingStore } from '@/app/stores/loading'

describe('API request feedback', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('starts loading before the request and always stops on success', async () => {
    const store = useLoadingStore()
    const request = vi.fn(async () => {
      expect(store.isLoading).toBe(true)
      expect(store.message).toBe('Custom request')
      return { id: 'result' }
    })
    await expect(withApiLoading(request, 'Custom request')).resolves.toEqual({
      id: 'result',
    })
    expect(store.isLoading).toBe(false)
  })

  it('clears loading while preserving request errors', async () => {
    const error = new Error('request failed')
    await expect(
      withApiLoading(async () => {
        throw error
      }),
    ).rejects.toBe(error)
    expect(useLoadingStore().activeRequests).toBe(0)
  })

  it('supports background requests without changing global loading', async () => {
    const store = useLoadingStore()
    store.start('Foreground')
    await expect(
      withApiLoading(async () => 42, undefined, { useGlobalLoading: false }),
    ).resolves.toBe(42)
    expect(store.activeRequests).toBe(1)
    expect(store.message).toBe('Foreground')
  })

  it('prefers a nonempty status message and then response data', () => {
    expect(
      extractApiErrorMessage(
        Object.assign(new Error('internal'), {
          statusMessage: ' First ',
          data: { statusMessage: 'Second' },
        }),
      ),
    ).toBe('First')
    expect(
      extractApiErrorMessage(
        Object.assign(new Error('internal'), {
          statusMessage: ' ',
          data: { statusMessage: ' Second ' },
        }),
      ),
    ).toBe('Second')
    expect(extractApiErrorMessage(new Error('internal'), 'Fallback')).toBe(
      'Fallback',
    )
    expect(
      extractApiErrorMessage({ statusMessage: 'untrusted' }, 'Fallback'),
    ).toBe('Fallback')
    expect(extractApiErrorMessage(null)).toBe(
      'Unable to process your request right now.',
    )
  })
})
