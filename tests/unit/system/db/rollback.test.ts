import { describe, expect, it, vi } from 'vitest'

import { executeWithRollback } from '@/server/utils/db/executeWithRollback'

describe('mutation compensation', () => {
  it('returns the operation result without rolling back a successful mutation', async () => {
    const rollback = vi.fn()
    const result = { id: 'created-record' }

    await expect(
      executeWithRollback({ operation: async () => result, rollback }),
    ).resolves.toBe(result)
    expect(rollback).not.toHaveBeenCalled()
  })

  it('waits for compensation and preserves the original operation error', async () => {
    const error = new Error('second write failed')
    const steps: string[] = []
    const onRollbackError = vi.fn()

    await expect(
      executeWithRollback({
        operation: async () => {
          steps.push('write')
          throw error
        },
        rollback: async () => {
          steps.push('compensate')
        },
        onRollbackError,
      }),
    ).rejects.toBe(error)
    expect(steps).toEqual(['write', 'compensate'])
    expect(onRollbackError).not.toHaveBeenCalled()
  })

  it('reports compensation failure without replacing the original failure', async () => {
    const original = new Error('write failed')
    const compensation = new Error('rollback failed')
    const onRollbackError = vi.fn()

    await expect(
      executeWithRollback({
        operation: async () => {
          throw original
        },
        rollback: async () => {
          throw compensation
        },
        onRollbackError,
      }),
    ).rejects.toBe(original)
    expect(onRollbackError).toHaveBeenCalledExactlyOnceWith(compensation)
  })

  it('preserves a failure when no rollback error callback is configured', async () => {
    const original = new Error('write failed')

    await expect(
      executeWithRollback({
        operation: async () => {
          throw original
        },
        rollback: async () => {
          throw new Error('rollback failed')
        },
      }),
    ).rejects.toBe(original)
  })
})
