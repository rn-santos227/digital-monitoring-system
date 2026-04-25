import type { Ref } from 'vue'
import type { BattalionSearchQuery, UpdateBattalionPayload } from '~/types/domain/units'
import { BATTALION_ACTION_KEYS } from './index.handler'

type BattalionRow = Record<string, unknown>

const resolveBattalionActionRowId = (row: BattalionRow): string => {
  return String(row.id ?? '')
}

interface UseUpdateBattalionHandlerOptions {
  selectedBattalionId: Ref<string>
  selectedBattalion: Ref<{ code: string; name: string; isActive: boolean } | null>
  isUpdateBattalionModalOpen: Ref<boolean>
  getBattalionById: (id: string) => Promise<{ code: string; name: string; isActive: boolean }>
  updateBattalion: (id: string, payload: UpdateBattalionPayload) => Promise<void>
  loadBattalions: (page?: number, filters?: Partial<BattalionSearchQuery>) => Promise<void>
  battalionPagination: Ref<{ page: number }>
  battalionFilters: Ref<Partial<BattalionSearchQuery>>
}

export const useUpdateBattalionHandler = ({
  selectedBattalionId,
  selectedBattalion,
  isUpdateBattalionModalOpen,
  getBattalionById,
  updateBattalion,
  loadBattalions,
  battalionPagination,
  battalionFilters,
}: UseUpdateBattalionHandlerOptions) => {
  const onCloseUpdateBattalionModal = () => {
    isUpdateBattalionModalOpen.value = false
    selectedBattalionId.value = ''
    selectedBattalion.value = null
  }

  const onUpdateBattalion = async (payload: UpdateBattalionPayload) => {
    if (!selectedBattalionId.value) {
      return
    }

    await updateBattalion(selectedBattalionId.value, payload)
    onCloseUpdateBattalionModal()
    await loadBattalions(battalionPagination.value.page, battalionFilters.value)
  }

  const onEditBattalionAction = async (row: BattalionRow): Promise<boolean> => {
    const selectedBattalionRowId = resolveBattalionActionRowId(row)
    if (!selectedBattalionRowId) {
      return true
    }

    const selected = await getBattalionById(selectedBattalionRowId)
    selectedBattalionId.value = selectedBattalionRowId
    selectedBattalion.value = {
      code: selected.code,
      name: selected.name,
      isActive: selected.isActive,
    }
    isUpdateBattalionModalOpen.value = true
    return true
  }

  const canHandleUpdateBattalionAction = (actionKey: string): boolean => {
    return actionKey === BATTALION_ACTION_KEYS.edit
  }

  return {
    canHandleUpdateBattalionAction,
    onEditBattalionAction,
    onUpdateBattalion,
    onCloseUpdateBattalionModal,
  }
}
