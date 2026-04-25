import type { Ref } from 'vue'
import type { CompanyDetailItem } from '~/types/domain/units'
import { COMPANY_ACTION_KEYS } from './index.handler'

type CompanyRow = Record<string, unknown>

const resolveCompanyId = (row: CompanyRow): string => {
  return String(row.id ?? '')
}

interface UseViewCompanyHandlerOptions {
  selectedCompanyId: Ref<string>
  selectedCompanyView: Ref<CompanyDetailItem | null>
  isViewCompanyModalOpen: Ref<boolean>
  getCompanyById: (id: string) => Promise<CompanyDetailItem>
}

export const useViewCompanyHandler = ({
  selectedCompanyId,
  selectedCompanyView,
  isViewCompanyModalOpen,
  getCompanyById,
}: UseViewCompanyHandlerOptions) => {
  const onCloseViewCompanyModal = () => {
    selectedCompanyId.value = ''
    selectedCompanyView.value = null
    isViewCompanyModalOpen.value = false
  }

  const onViewCompanyAction = async (row: CompanyRow): Promise<boolean> => {
    const companyId = resolveCompanyId(row)
    if (!companyId) {
      return true
    }

    const company = await getCompanyById(companyId)
    selectedCompanyId.value = companyId
    selectedCompanyView.value = company
    isViewCompanyModalOpen.value = true

    return true
  }

  const canHandleViewCompanyAction = (actionKey: string): boolean => {
    return actionKey === COMPANY_ACTION_KEYS.view
  }

  return {
    canHandleViewCompanyAction,
    onViewCompanyAction,
    onCloseViewCompanyModal,
  }
}
