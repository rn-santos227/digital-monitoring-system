import { useState } from "nuxt/app"

export type DialogType = 'success' | 'warning' | 'error' | 'info' | 'question' | 'prompt'

export type DialogResult = {
  confirmed: boolean
  value?: string
}

export type DialogInput = {
  type: DialogType
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  placeholder?: string
  defaultValue?: string
}

export type DialogState = DialogInput & {
  id: string
  showCancel: boolean
}

const DIALOG_STATE_KEY = 'ui-dialog'

const useDialogState = () => useState<DialogState | null>(DIALOG_STATE_KEY, () => null)

const createDialogId = () => `dialog-${Date.now()}-${Math.random().toString(16).slice(2)}`

let activeResolver: ((result: DialogResult) => void) | null = null

const resolveDialog = (result: DialogResult) => {
  if (!activeResolver) {
    return
  }

  activeResolver(result)
  activeResolver = null
}

export const useDialog = () => {
  const dialog = useDialogState()

  const closeDialog = (result: DialogResult) => {
    dialog.value = null
    resolveDialog(result)
  }

  const showDialog = (input: DialogInput) => {
    const id = createDialogId()
    const showCancel = ['question', 'warning', 'prompt'].includes(input.type)

    dialog.value = {
      id,
      showCancel,
      confirmLabel:
        input.confirmLabel ??
        (input.type === 'question'
          ? 'Yes'
          : input.type === 'warning'
            ? 'Proceed'
            : input.type === 'prompt'
              ? 'Submit'
              : 'OK'),
      cancelLabel: input.cancelLabel ?? 'Cancel',
      ...input
    }

    return new Promise<DialogResult>((resolve) => {
      activeResolver = resolve
    })
  }

  return {
    dialog,
    showDialog,
    closeDialog
  }
}
