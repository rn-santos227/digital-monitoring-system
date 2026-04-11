export function extractHttpStatusCode(error: unknown): number | null {
  if (typeof error !== 'object' || error === null) {
    return null
  }

  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode
  }

  if ('status' in error && typeof error.status === 'number') {
    return error.status
  }

  if ('response' in error && typeof error.response === 'object' && error.response !== null) {
    const { response } = error

    if ('status' in response && typeof response.status === 'number') {
      return response.status
    }
  }

  return null
}
