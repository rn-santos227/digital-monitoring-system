import { describe, expect, it, vi } from 'vitest'

import {
  createModalFeedbackHandler,
  runWithModalFeedback,
} from '@/app/utils/modal-feedback'
import {
  resolveErrorMessage,
  showErrorDialog,
} from '@/app/utils/error-handling'

const config = {
  successTitle: 'Created',
  successMessage: 'Record created.',
  errorMessage: 'Unable to create record.',
}

describe('modal mutation feedback', () => {
  it('passes the payload to the action before showing success', async () => {
    const order: string[] = []
    const payload = { id: 'record' }
    const action = vi.fn(async () => {
      order.push('action')
    })
    const showDialog = vi.fn(async () => {
      order.push('dialog')
    })

    await expect(
      runWithModalFeedback(payload, action, showDialog, config),
    ).resolves.toBe(true)
    expect(action).toHaveBeenCalledWith(payload)
    expect(showDialog).toHaveBeenCalledWith({
      type: 'success',
      title: 'Created',
      message: 'Record created.',
      confirmLabel: 'OK',
    })
    expect(order).toEqual(['action', 'dialog'])
  })

  it.each([undefined, 'Create failed'])(
    'shows failure using error title %s',
    async (errorTitle) => {
      const showDialog = vi.fn()
      const action = vi
        .fn()
        .mockRejectedValue(new Error('Database unavailable'))

      await expect(
        runWithModalFeedback({}, action, showDialog, { ...config, errorTitle }),
      ).resolves.toBe(false)
      expect(showDialog).toHaveBeenCalledExactlyOnceWith({
        type: 'error',
        title: errorTitle ?? 'Operation failed',
        message: config.errorMessage,
        confirmLabel: 'OK',
      })
    },
  )

  it('calls the success callback only after a successful action', async () => {
    const action = vi.fn().mockResolvedValue(undefined)
    const showDialog = vi.fn()
    const onSuccess = vi.fn()
    const submit = createModalFeedbackHandler(
      action,
      showDialog,
      config,
      onSuccess,
    )
    await submit({})
    expect(onSuccess).toHaveBeenCalledOnce()
    action.mockRejectedValueOnce(new Error('failed'))
    await submit({})
    expect(onSuccess).toHaveBeenCalledOnce()
    await createModalFeedbackHandler(vi.fn(), showDialog, config)({})
  })

  it('resolves useful errors and shares the same message with the dialog and form', async () => {
    expect(resolveErrorMessage(new Error('Details'))).toBe('Details')
    expect(resolveErrorMessage(new Error(' '), 'Fallback')).toBe('Fallback')
    expect(resolveErrorMessage({ message: 'untrusted' }, 'Fallback')).toBe(
      'Fallback',
    )
    const showDialog = vi.fn().mockResolvedValue({ confirmed: true })
    await expect(
      showErrorDialog({
        showDialog,
        title: 'Failed',
        error: null,
        fallbackMessage: 'Fallback',
      }),
    ).resolves.toBe('Fallback')
    expect(showDialog).toHaveBeenCalledWith({
      type: 'error',
      title: 'Failed',
      message: 'Fallback',
      confirmLabel: 'OK',
    })
  })
})
