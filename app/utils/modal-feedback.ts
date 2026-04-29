export interface ModalFeedbackConfig {
  successTitle: string
  successMessage: string
  errorTitle?: string
  errorMessage: string
}

export interface DialogFeedbackPayload {
  type: 'success' | 'error'
  title: string
  message: string
  confirmLabel: string
}

export type ShowDialogHandler = (payload: DialogFeedbackPayload) => Promise<unknown>

export const runWithModalFeedback = async <TPayload>(
  payload: TPayload,
  action: (payload: TPayload) => Promise<void>,
  showDialog: ShowDialogHandler,
  config: ModalFeedbackConfig,
): Promise<boolean> => {
  try {
    await action(payload)
    await showDialog({
      type: 'success',
      title: config.successTitle,
      message: config.successMessage,
      confirmLabel: 'OK',
    })
    return true
  } catch {
    await showDialog({
      type: 'error',
      title: config.errorTitle ?? 'Operation failed',
      message: config.errorMessage,
      confirmLabel: 'OK',
    })
    return false
  }
}

export const createModalFeedbackHandler = <TPayload>(
  action: (payload: TPayload) => Promise<void>,
  showDialog: ShowDialogHandler,
  config: ModalFeedbackConfig,
  onSuccess?: () => void,
) => {
  return async (payload: TPayload) => {
    const isSuccess = await runWithModalFeedback(payload, action, showDialog, config)
    if (isSuccess) {
      onSuccess?.()
    }
  }
}
