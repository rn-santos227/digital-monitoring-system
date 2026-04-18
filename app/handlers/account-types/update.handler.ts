import type { Ref } from 'vue'
import type { UpdateAccountTypePayload, UserAccountsSearchQuery } from '~/types/domain/users'
import { ACCOUNT_TYPE_ACTION_KEYS } from './index.handler'

interface UseUpdateAccountTypeHandlerOptions {
  selectedAccountTypeId: Ref<string>
  selectedAccountType: Ref<{
    code: string
    name: string
    description: string | null
    isSystem: boolean
    permissionIds: string[]
  } | null>
  isUpdateAccountTypeModalOpen: Ref<boolean>
  getAccountTypeById: (id: string) => Promise<{
    code: string
    name: string
    description: string | null
    isSystem: boolean
    permissionIds: string[]
  }>
  updateAccountType: (id: string, payload: UpdateAccountTypePayload) => Promise<void>
  loadUserAccounts: (page?: number, filters?: Partial<UserAccountsSearchQuery>) => Promise<void>
  accountPagination: Ref<{ page: number }>
  accountFilters: Ref<Partial<UserAccountsSearchQuery>>
}

type AccountTypeRow = Record<string, unknown>

const resolveAccountTypeActionRowId = (row: AccountTypeRow): string => {
  return String(row.id ?? '')
}

export const useUpdateAccountTypeHandler = ({
  selectedAccountTypeId,
  selectedAccountType,
  isUpdateAccountTypeModalOpen,
  getAccountTypeById,
  updateAccountType,
  loadUserAccounts,
  accountPagination,
  accountFilters,
}: UseUpdateAccountTypeHandlerOptions) => {
  const onCloseUpdateAccountTypeModal = () => {
    isUpdateAccountTypeModalOpen.value = false
    selectedAccountTypeId.value = ''
    selectedAccountType.value = null
  }

  const onUpdateAccountType = async (payload: UpdateAccountTypePayload) => {
    if (!selectedAccountTypeId.value) {
      return
    }

    await updateAccountType(selectedAccountTypeId.value, payload)
    onCloseUpdateAccountTypeModal()
    await loadUserAccounts(accountPagination.value.page, accountFilters.value)
  }

  const onEditAccountTypeAction = async (row: AccountTypeRow): Promise<boolean> => {
    const selectedAccountTypeRowId = resolveAccountTypeActionRowId(row)
    if (!selectedAccountTypeRowId) {
      return true
    }

    const selected = await getAccountTypeById(selectedAccountTypeRowId)
    selectedAccountTypeId.value = selectedAccountTypeRowId
    selectedAccountType.value = {
      code: selected.code,
      name: selected.name,
      description: selected.description,
      isSystem: selected.isSystem,
      permissionIds: selected.permissionIds,
    }
    isUpdateAccountTypeModalOpen.value = true
    return true
  }

  const canHandleUpdateAccountTypeAction = (actionKey: string): boolean => {
    return actionKey === ACCOUNT_TYPE_ACTION_KEYS.edit
  }

  return {
    canHandleUpdateAccountTypeAction,
    onEditAccountTypeAction,
    onUpdateAccountType,
    onCloseUpdateAccountTypeModal,
  }
}
