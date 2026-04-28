import { GENERIC_ERROR_MESSAGE } from '~/constants/error.constants'
import type { DialogInput } from '~/composables/useDialog'

interface ShowErrorDialogOptions {
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  title: string
  error: unknown
  fallbackMessage?: string
}

export const resolveErrorMessage = (error: unknown, fallbackMessage = GENERIC_ERROR_MESSAGE): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallbackMessage
}

export const showErrorDialog = async ({
  showDialog,
  title,
  error,
  fallbackMessage = GENERIC_ERROR_MESSAGE,
}: ShowErrorDialogOptions): Promise<string> => {
  const message = resolveErrorMessage(error, fallbackMessage)

  await showDialog({
    type: 'error',
    title,
    message,
    confirmLabel: 'OK',
  })

  return message
}
