import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDialog } from '@/app/composables/useDialog'
import { useModal } from '@/app/composables/useModal'
import { useToast } from '@/app/composables/useToast'
import { clearNuxtState } from '@/tests/helpers/nuxt-state'

beforeEach(() => {
  clearNuxtState()
  vi.useFakeTimers()
})
afterEach(() => vi.useRealTimers())

describe('shared dialog lifecycle', () => {
  it.each([
    { type: 'question', confirmLabel: 'Yes', showCancel: true },
    { type: 'warning', confirmLabel: 'Proceed', showCancel: true },
    { type: 'prompt', confirmLabel: 'Submit', showCancel: true },
    { type: 'info', confirmLabel: 'OK', showCancel: false },
    { type: 'information', confirmLabel: 'OK', showCancel: false },
    { type: 'success', confirmLabel: 'OK', showCancel: false },
    { type: 'error', confirmLabel: 'OK', showCancel: false },
  ] as const)(
    'sets defaults for $type and resolves only on dismissal',
    async ({ type, confirmLabel, showCancel }) => {
      const controller = useDialog()
      const result = controller.showDialog({ type, title: 'Test' })
      expect(controller.dialog.value).toMatchObject({
        type,
        title: 'Test',
        confirmLabel,
        showCancel,
        cancelLabel: 'Cancel',
      })
      controller.closeDialog({ confirmed: true, value: 'input' })
      await expect(result).resolves.toEqual({ confirmed: true, value: 'input' })
      expect(controller.dialog.value).toBeNull()
      controller.closeDialog({ confirmed: false })
    },
  )

  it('shares dialog state between callers and honors custom labels', async () => {
    const first = useDialog()
    const second = useDialog()
    const result = first.showDialog({
      type: 'question',
      title: 'Confirm',
      confirmLabel: 'Save',
      cancelLabel: 'Keep editing',
    })
    expect(second.dialog.value?.confirmLabel).toBe('Save')
    second.closeDialog({ confirmed: false })
    await expect(result).resolves.toEqual({ confirmed: false })
  })
})

describe('toast lifecycle', () => {
  it('removes timed notices while retaining persistent ones', () => {
    const controller = useToast()
    controller.addToast({ title: 'Timed' })
    const persistent = controller.addToast({
      title: 'Persistent',
      duration: 0,
      variant: 'success',
    })
    expect(controller.toasts.value).toHaveLength(2)
    vi.advanceTimersByTime(4000)
    expect(controller.toasts.value.map((toast) => toast.id)).toEqual([
      persistent,
    ])
    controller.removeToast('missing')
    expect(controller.toasts.value).toHaveLength(1)
    controller.removeToast(persistent)
    expect(controller.toasts.value).toEqual([])
  })
})

describe('modal lifecycle', () => {
  it('opens independent modals with defaults and selectively closes them', () => {
    const controller = useModal()
    const component = { render: () => null }
    const first = controller.openModal({ component })
    const second = controller.openModal({
      component,
      size: 'lg',
      closeOnBackdrop: false,
      title: 'Details',
    })
    expect(controller.modals.value[0]).toMatchObject({
      id: first,
      size: 'md',
      closeOnBackdrop: true,
    })
    expect(controller.modals.value[1]).toMatchObject({
      id: second,
      size: 'lg',
      closeOnBackdrop: false,
    })
    controller.closeModal(first)
    expect(controller.modals.value.map((modal) => modal.id)).toEqual([second])
    controller.closeAllModals()
    expect(controller.modals.value).toEqual([])
  })
})
