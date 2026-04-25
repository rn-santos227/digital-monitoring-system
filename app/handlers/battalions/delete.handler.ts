import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import {
  BATTALION_DELETE_DIALOG_MESSAGE,
  BATTALION_DELETE_DIALOG_TITLE,
  UNITS_MODAL_CANCEL_LABEL,
} from '~/constants/page.constants'
import type { BattalionSearchQuery } from '~/types/domain/units'
import { BATTALION_ACTION_KEYS } from './index.handler'

type BattalionRow = Record<string, unknown>

const DELETE_BATTALION_DIALOG: DialogInput = Object.freeze({
  type: 'warning',
  title: BATTALION_DELETE_DIALOG_TITLE,
  message: BATTALION_DELETE_DIALOG_MESSAGE,
  confirmLabel: 'Delete',
  cancelLabel: UNITS_MODAL_CANCEL_LABEL,
})

const resolveBattalionActionRowId = (row: BattalionRow): string => {
  return String(row.id ?? '')
}

interface UseDeleteBattalionHandlerOptions {
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  deleteBattalion: (id: string) => Promise<void>
  loadBattalions: (page?: number, filters?: Partial<BattalionSearchQuery>) => Promise<void>
  battalionPagination: Ref<{ page: number }>
  battalionFilters: Ref<Partial<BattalionSearchQuery>>
}

export const useDeleteBattalionHandler = ({
  showDialog,
  deleteBattalion,
  loadBattalions,
  battalionPagination,
  battalionFilters,
}: UseDeleteBattalionHandlerOptions) => {
  const onDeleteBattalionAction = async (row: BattalionRow): Promise<boolean> => {
    const selectedBattalionRowId = resolveBattalionActionRowId(row)
    if (!selectedBattalionRowId) {
      return true
    }

    const result = await showDialog(DELETE_BATTALION_DIALOG)
    if (!result.confirmed) {
      return true
    }

    await deleteBattalion(selectedBattalionRowId)
    await loadBattalions(battalionPagination.value.page, battalionFilters.value)
    return true
  }

  const canHandleDeleteBattalionAction = (actionKey: string): boolean => {
    return actionKey === BATTALION_ACTION_KEYS.delete
  }

  return {
    canHandleDeleteBattalionAction,
    onDeleteBattalionAction,
  }
}
