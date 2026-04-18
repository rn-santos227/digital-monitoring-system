export const ACCOUNT_TYPE_ACTION_KEYS = Object.freeze({
  edit: 'edit-account-type',
  delete: 'delete-account-type',
})

interface AccountTypeActionPayload {
  actionKey: string
  row: Record<string, unknown>
}

interface UseAccountTypeActionHandlerOptions {
  onEditAccountTypeAction: (row: Record<string, unknown>) => Promise<boolean>
  onDeleteAccountTypeAction: (row: Record<string, unknown>) => Promise<boolean>
  canHandleUpdateAccountTypeAction: (actionKey: string) => boolean
  canHandleDeleteAccountTypeAction: (actionKey: string) => boolean
}

export const useAccountTypeActionHandler = ({
  onEditAccountTypeAction,
  onDeleteAccountTypeAction,
  canHandleUpdateAccountTypeAction,
  canHandleDeleteAccountTypeAction,
}: UseAccountTypeActionHandlerOptions) => {
  const onAccountTypeAction = async (payload: AccountTypeActionPayload) => {
    if (canHandleUpdateAccountTypeAction(payload.actionKey)) {
      await onEditAccountTypeAction(payload.row)
      return
    }

    if (canHandleDeleteAccountTypeAction(payload.actionKey)) {
      await onDeleteAccountTypeAction(payload.row)
    }
  }

  return {
    onAccountTypeAction,
  }
}
