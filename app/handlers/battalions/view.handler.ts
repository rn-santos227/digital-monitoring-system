import type { Ref } from 'vue'
import type { BattalionDetailItem } from '~/types/domain/units'
import { BATTALION_ACTION_KEYS } from './index.handler'

type BattalionRow = Record<string, unknown>

const resolveBattalionId = (row: BattalionRow): string => {
  return String(row.id ?? '')
}

interface UseViewBattalionHandlerOptions {
  selectedBattalionId: Ref<string>
  selectedBattalionView: Ref<BattalionDetailItem | null>
  isViewBattalionModalOpen: Ref<boolean>
  getBattalionById: (id: string) => Promise<BattalionDetailItem>
}

export const useViewBattalionHandler = ({
  selectedBattalionId,
  selectedBattalionView,
  isViewBattalionModalOpen,
  getBattalionById,
}: UseViewBattalionHandlerOptions) => {
  const onCloseViewBattalionModal = () => {
    selectedBattalionId.value = ''
    selectedBattalionView.value = null
    isViewBattalionModalOpen.value = false
  }

  const onViewBattalionAction = async (row: BattalionRow): Promise<boolean> => {
    const battalionId = resolveBattalionId(row)
    if (!battalionId) {
      return true
    }

    const battalion = await getBattalionById(battalionId)
    selectedBattalionId.value = battalionId
    selectedBattalionView.value = battalion
    isViewBattalionModalOpen.value = true

    return true
  }

  const canHandleViewBattalionAction = (actionKey: string): boolean => {
    return actionKey === BATTALION_ACTION_KEYS.view
  }

  return {
    canHandleViewBattalionAction,
    onViewBattalionAction,
    onCloseViewBattalionModal,
  }
}
