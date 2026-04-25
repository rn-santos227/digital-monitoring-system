import type { Ref } from 'vue'
import type { CompanySearchQuery, UpdateCompanyPayload } from '~/types/domain/units'
import { COMPANY_ACTION_KEYS } from './index.handler'

type CompanyRow = Record<string, unknown>

const resolveCompanyActionRowId = (row: CompanyRow): string => {
  return String(row.id ?? '')
}

interface UseUpdateCompanyHandlerOptions {
  selectedCompanyId: Ref<string>
  selectedCompany: Ref<{ battalionId: string | null; code: string; name: string; isActive: boolean } | null>
  isUpdateCompanyModalOpen: Ref<boolean>
  getCompanyById: (id: string) => Promise<{ battalionId: string | null; code: string; name: string; isActive: boolean }>
  updateCompany: (id: string, payload: UpdateCompanyPayload) => Promise<void>
  loadCompanies: (page?: number, filters?: Partial<CompanySearchQuery>) => Promise<void>
  companyPagination: Ref<{ page: number }>
  companyFilters: Ref<Partial<CompanySearchQuery>>
}

export const useUpdateCompanyHandler = ({
  selectedCompanyId,
  selectedCompany,
  isUpdateCompanyModalOpen,
  getCompanyById,
  updateCompany,
  loadCompanies,
  companyPagination,
  companyFilters,
}: UseUpdateCompanyHandlerOptions) => {
  const onCloseUpdateCompanyModal = () => {
    isUpdateCompanyModalOpen.value = false
    selectedCompanyId.value = ''
    selectedCompany.value = null
  }

  const onUpdateCompany = async (payload: UpdateCompanyPayload) => {
    if (!selectedCompanyId.value) {
      return
    }

    await updateCompany(selectedCompanyId.value, payload)
    onCloseUpdateCompanyModal()
    await loadCompanies(companyPagination.value.page, companyFilters.value)
  }

  const onEditCompanyAction = async (row: CompanyRow): Promise<boolean> => {
    const selectedCompanyRowId = resolveCompanyActionRowId(row)
    if (!selectedCompanyRowId) {
      return true
    }

    const selected = await getCompanyById(selectedCompanyRowId)
    selectedCompanyId.value = selectedCompanyRowId
    selectedCompany.value = {
      battalionId: selected.battalionId,
      code: selected.code,
      name: selected.name,
      isActive: selected.isActive,
    }
    isUpdateCompanyModalOpen.value = true
    return true
  }

  const canHandleUpdateCompanyAction = (actionKey: string): boolean => {
    return actionKey === COMPANY_ACTION_KEYS.edit
  }

  return {
    canHandleUpdateCompanyAction,
    onEditCompanyAction,
    onUpdateCompany,
    onCloseUpdateCompanyModal,
  }
}
