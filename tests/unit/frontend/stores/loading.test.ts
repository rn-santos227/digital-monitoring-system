import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useLoadingStore } from '@/app/stores/loading'

describe('global request loading state', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('keeps the loader visible until every concurrent request finishes', () => {
    const store = useLoadingStore()
    store.start('Loading records')
    store.start()
    expect(store.activeRequests).toBe(2)
    expect(store.isLoading).toBe(true)
    store.stop()
    expect(store.isLoading).toBe(true)
    expect(store.message).toBe('Loading records')
    store.stop()
    expect(store.isLoading).toBe(false)
    expect(store.message).toBe('Processing request...')
    store.stop()
    expect(store.activeRequests).toBe(0)
  })

  it('resets all pending requests', () => {
    const store = useLoadingStore()
    store.start('Custom')
    store.reset()
    expect(store.$state).toEqual({
      activeRequests: 0,
      message: 'Processing request...',
    })
  })
})
