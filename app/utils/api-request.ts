import { useLoadingStore } from '~/stores/loading'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

export const extractApiErrorMessage = (
  error: unknown,
  fallbackMessage = 'Unable to process your request right now.'
): string => {
  if (error instanceof Error) {
    const statusMessage = isRecord(error) && typeof error.statusMessage === 'string'
      ? error.statusMessage
      : ''
    if (statusMessage.trim()) {
      return statusMessage.trim()
    }

    const responseData = isRecord(error) && isRecord(error.data) ? error.data : null
    if (responseData && typeof responseData.statusMessage === 'string' && responseData.statusMessage.trim()) {
      return responseData.statusMessage.trim()
    }
  }

  return fallbackMessage
}

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
