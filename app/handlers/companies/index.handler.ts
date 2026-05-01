import type { Ref } from 'vue'
import { useCompanySearchHandlers } from './search.handler'
import type { CompanySearchQuery } from '~/types/domain/units'

export const COMPANY_ACTION_KEYS = Object.freeze({
  view: 'view-company',
  edit: 'edit-company',
  delete: 'delete-company',
})

interface CompanyActionPayload {
  actionKey: string
  row: Record<string, unknown>
}

interface UseCompanyActionHandlerOptions {
  onViewCompanyAction: (row: Record<string, unknown>) => Promise<boolean>
  onEditCompanyAction: (row: Record<string, unknown>) => Promise<boolean>
  onDeleteCompanyAction: (row: Record<string, unknown>) => Promise<boolean>
  canHandleViewCompanyAction: (actionKey: string) => boolean
  canHandleUpdateCompanyAction: (actionKey: string) => boolean
  canHandleDeleteCompanyAction: (actionKey: string) => boolean
}

export const useCompanyActionHandler = ({
  onViewCompanyAction,
  onEditCompanyAction,
  onDeleteCompanyAction,
  canHandleViewCompanyAction,
  canHandleUpdateCompanyAction,
  canHandleDeleteCompanyAction,
}: UseCompanyActionHandlerOptions) => {
  const onCompanyAction = async (payload: CompanyActionPayload) => {
    if (canHandleViewCompanyAction(payload.actionKey)) {
      await onViewCompanyAction(payload.row)
      return
    }

    if (canHandleUpdateCompanyAction(payload.actionKey)) {
      await onEditCompanyAction(payload.row)
      return
    }

    if (canHandleDeleteCompanyAction(payload.actionKey)) {
      await onDeleteCompanyAction(payload.row)
    }
  }

  return { onCompanyAction }
}

export const useCompanyFilterHandlers = (filters: Ref<Partial<CompanySearchQuery>>) => useCompanySearchHandlers(filters)
