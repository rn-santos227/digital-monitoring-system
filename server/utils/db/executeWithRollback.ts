interface ExecuteWithRollbackInput<T> {
  operation: () => Promise<T>
  rollback: () => Promise<void>
  onRollbackError?: (error: unknown) => void
}

export const executeWithRollback = async <T>(input: ExecuteWithRollbackInput<T>): Promise<T> => {
  try {
    return await input.operation()
  } catch (error) {
    try {
      await input.rollback()
    } catch (rollbackError) {
      input.onRollbackError?.(rollbackError)
    }

    throw error
  }
}
