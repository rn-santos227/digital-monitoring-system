import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type { UserAccountsSearchQuery } from '~/types/domain/users'
import { ACCOUNT_TYPE_ACTION_KEYS } from './index.handler'
import { showErrorDialog } from '~/utils/error-handling'

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
  loadUserAccounts: (page?: number, filters?: Partial<UserAccountsSearchQuery>) => Promise<void>
  accountPagination: Ref<{ page: number }>
  accountFilters: Ref<Partial<UserAccountsSearchQuery>>
  onDeleteSuccess?: () => void | Promise<void>
  onDeleteCancelled?: () => void | Promise<void>
}

export const useDeleteAccountTypeHandler = ({
  showDialog,
  deleteAccountType,
  loadUserAccounts,
  accountPagination,
  accountFilters,
  onDeleteSuccess,
  onDeleteCancelled,
}: UseDeleteAccountTypeHandlerOptions) => {
  const onDeleteAccountTypeAction = async (row: AccountTypeRow): Promise<boolean> => {
    const selectedAccountTypeRowId = resolveAccountTypeActionRowId(row)
    if (!selectedAccountTypeRowId) {
      return true
    }

    const result = await showDialog(DELETE_ACCOUNT_TYPE_DIALOG)
    if (!result.confirmed) {
      await onDeleteCancelled?.()
      return true
    }

    try {
      await deleteAccountType(selectedAccountTypeRowId)
      await loadUserAccounts(accountPagination.value.page, accountFilters.value)
      await onDeleteSuccess?.()
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Account type deletion failed',
        error,
        fallbackMessage: 'Unable to delete account type right now.',
      })
    }
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
