import type { Ref } from 'vue'
import { useBattalionSearchHandlers } from './search.handler'
import type { BattalionSearchQuery } from '~/types/domain/units'

export const BATTALION_ACTION_KEYS = Object.freeze({
  view: 'view-battalion',
  edit: 'edit-battalion',
  delete: 'delete-battalion',
})

interface BattalionActionPayload {
  actionKey: string
  row: Record<string, unknown>
}

interface UseBattalionActionHandlerOptions {
  onViewBattalionAction: (row: Record<string, unknown>) => Promise<boolean>
  onEditBattalionAction: (row: Record<string, unknown>) => Promise<boolean>
  onDeleteBattalionAction: (row: Record<string, unknown>) => Promise<boolean>
  canHandleViewBattalionAction: (actionKey: string) => boolean
  canHandleUpdateBattalionAction: (actionKey: string) => boolean
  canHandleDeleteBattalionAction: (actionKey: string) => boolean
}

export const useBattalionActionHandler = ({
  onViewBattalionAction,
  onEditBattalionAction,
  onDeleteBattalionAction,
  canHandleViewBattalionAction,
  canHandleUpdateBattalionAction,
  canHandleDeleteBattalionAction,
}: UseBattalionActionHandlerOptions) => {
  const onBattalionAction = async (payload: BattalionActionPayload) => {
    if (canHandleViewBattalionAction(payload.actionKey)) {
      await onViewBattalionAction(payload.row)
      return
    }

    if (canHandleUpdateBattalionAction(payload.actionKey)) {
      await onEditBattalionAction(payload.row)
      return
    }

    if (canHandleDeleteBattalionAction(payload.actionKey)) {
      await onDeleteBattalionAction(payload.row)
    }
  }

  return { onBattalionAction }
}

export const useBattalionFilterHandlers = (filters: Ref<Partial<BattalionSearchQuery>>) => useBattalionSearchHandlers(filters)
