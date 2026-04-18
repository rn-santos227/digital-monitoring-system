import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import { ACCOUNT_TYPE_ACTION_KEYS } from './index.handler'

type AccountTypeRow = Record<string, unknown>

const resolveAccountTypeActionRowId = (row: AccountTypeRow): string => {
  return String(row.id ?? '')
}

const DELETE_ACCOUNT_TYPE_DIALOG: DialogInput = Object.freeze({
  type: 'warning',
  title: 'Delete account type?',
  message: 'This action cannot be undone. Do you want to continue?',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
})

interface UseDeleteAccountTypeHandlerOptions {
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  deleteAccountType: (id: string) => Promise<void>
  loadUserAccounts: (page?: number, search?: string) => Promise<void>
  accountPagination: Ref<{ page: number }>
  accountSearchQuery: Ref<string>
}

export const useDeleteAccountTypeHandler = ({
  showDialog,
  deleteAccountType,
  loadUserAccounts,
  accountPagination,
  accountSearchQuery,
}: UseDeleteAccountTypeHandlerOptions) => {
  const onDeleteAccountTypeAction = async (row: AccountTypeRow): Promise<boolean> => {
    const selectedAccountTypeRowId = resolveAccountTypeActionRowId(row)
    if (!selectedAccountTypeRowId) {
      return true
    }

    const result = await showDialog(DELETE_ACCOUNT_TYPE_DIALOG)
    if (!result.confirmed) {
      return true
    }

    await deleteAccountType(selectedAccountTypeRowId)
    await loadUserAccounts(accountPagination.value.page, accountSearchQuery.value)
    return true
  }

  const canHandleDeleteAccountTypeAction = (actionKey: string): boolean => {
    return actionKey === ACCOUNT_TYPE_ACTION_KEYS.delete
  }

  return {
    canHandleDeleteAccountTypeAction,
    onDeleteAccountTypeAction,
  }
}
