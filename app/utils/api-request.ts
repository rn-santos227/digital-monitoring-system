import { useLoadingStore } from '~/stores/loading'

export const withApiLoading = async <T>(
  request: () => Promise<T>,
  loadingMessage = 'Processing request...'
): Promise<T> => {
  const loadingStore = useLoadingStore()
  loadingStore.start(loadingMessage)

  try {
    return await request()
  } finally {
    loadingStore.stop()
  }
}
