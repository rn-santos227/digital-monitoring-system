import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import {
  COMPANY_DELETE_DIALOG_MESSAGE,
  COMPANY_DELETE_DIALOG_TITLE,
  UNITS_MODAL_CANCEL_LABEL,
} from '~/constants/page.constants'
import type { CompanySearchQuery } from '~/types/domain/units'
import { COMPANY_ACTION_KEYS } from './index.handler'

type CompanyRow = Record<string, unknown>

const DELETE_COMPANY_DIALOG: DialogInput = Object.freeze({
  type: 'warning',
  title: COMPANY_DELETE_DIALOG_TITLE,
  message: COMPANY_DELETE_DIALOG_MESSAGE,
  confirmLabel: 'Delete',
  cancelLabel: UNITS_MODAL_CANCEL_LABEL,
})

const resolveCompanyActionRowId = (row: CompanyRow): string => {
  return String(row.id ?? '')
}

interface UseDeleteCompanyHandlerOptions {
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  deleteCompany: (id: string) => Promise<void>
  loadCompanies: (page?: number, filters?: Partial<CompanySearchQuery>) => Promise<void>
  companyPagination: Ref<{ page: number }>
  companyFilters: Ref<Partial<CompanySearchQuery>>
  onDeleteSuccess?: () => void | Promise<void>
  onDeleteCancelled?: () => void | Promise<void>
}

export const useDeleteCompanyHandler = ({
  showDialog,
  deleteCompany,
  loadCompanies,
  companyPagination,
  companyFilters,
  onDeleteSuccess,
  onDeleteCancelled,
}: UseDeleteCompanyHandlerOptions) => {
  const onDeleteCompanyAction = async (row: CompanyRow): Promise<boolean> => {
    const selectedCompanyRowId = resolveCompanyActionRowId(row)
    if (!selectedCompanyRowId) {
      return true
    }

    const result = await showDialog(DELETE_COMPANY_DIALOG)
    if (!result.confirmed) {
      await onDeleteCancelled?.()
      return true
    }

    await deleteCompany(selectedCompanyRowId)
    await loadCompanies(companyPagination.value.page, companyFilters.value)
    await onDeleteSuccess?.()
    return true
  }

  const canHandleDeleteCompanyAction = (actionKey: string): boolean => {
    return actionKey === COMPANY_ACTION_KEYS.delete
  }

  return {
    canHandleDeleteCompanyAction,
    onDeleteCompanyAction,
  }
}
