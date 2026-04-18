export const ACCOUNT_TYPE_ACTION_KEYS = Object.freeze({
  edit: 'edit-account-type',
  delete: 'delete-account-type',
})

interface AccountTypeActionPayload {
  actionKey: string
  row: Record<string, unknown>
}

export const useAccountTypeActionHandler = () => {
  const onAccountTypeAction = (_payload: AccountTypeActionPayload) => {
    // Account type edit/delete handlers remain pending.
  }

  return {
    onAccountTypeAction,
  }
}
