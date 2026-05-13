import type { Ref } from 'vue'

interface UseAssignCompanyHandlerOptions {
  selectedCompanyId: Ref<string>
  isAssignToCompanyModalOpen: Ref<boolean>
  assignPersonnel: (companyId: string, personnelId: string) => Promise<void>
}

export const COMPANY_ASSIGN_ACTION_KEY = 'assign-company'

export const useAssignCompanyHandler = ({ selectedCompanyId, isAssignToCompanyModalOpen, assignPersonnel }: UseAssignCompanyHandlerOptions) => {
  const canHandleAssignCompanyAction = (actionKey: string) => actionKey === COMPANY_ASSIGN_ACTION_KEY

  const onOpenAssignCompanyAction = async (row: Record<string, unknown>) => {
    const companyId = typeof row.id === 'string' ? row.id : ''
    if (!companyId) {
      return false
    }

    selectedCompanyId.value = companyId
    isAssignToCompanyModalOpen.value = true
    return true
  }

  const onCloseAssignToCompanyModal = () => {
    isAssignToCompanyModalOpen.value = false
    selectedCompanyId.value = ''
  }

  const onAssignToCompany = async (personnelId: string) => {
    if (!selectedCompanyId.value) {
      return
    }

    await assignPersonnel(selectedCompanyId.value, personnelId)
    onCloseAssignToCompanyModal()
  }

  return { canHandleAssignCompanyAction, onOpenAssignCompanyAction, onCloseAssignToCompanyModal, onAssignToCompany }
}
