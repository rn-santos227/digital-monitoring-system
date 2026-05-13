import type { Ref } from 'vue'

interface UseAssignBattalionHandlerOptions {
  selectedBattalionId: Ref<string>
  isAssignToBattalionModalOpen: Ref<boolean>
  assignPersonnel: (battalionId: string, personnelId: string) => Promise<void>
}

export const BATTALION_ASSIGN_ACTION_KEY = 'assign-battalion'

export const useAssignBattalionHandler = ({ selectedBattalionId, isAssignToBattalionModalOpen, assignPersonnel }: UseAssignBattalionHandlerOptions) => {
  const canHandleAssignBattalionAction = (actionKey: string) => actionKey === BATTALION_ASSIGN_ACTION_KEY

  const onOpenAssignBattalionAction = async (row: Record<string, unknown>) => {
    const battalionId = typeof row.id === 'string' ? row.id : ''
    if (!battalionId) {
      return false
    }

    selectedBattalionId.value = battalionId
    isAssignToBattalionModalOpen.value = true
    return true
  }

  const onCloseAssignToBattalionModal = () => {
    isAssignToBattalionModalOpen.value = false
    selectedBattalionId.value = ''
  }

  const onAssignToBattalion = async (personnelId: string) => {
    if (!selectedBattalionId.value) {
      return
    }

    await assignPersonnel(selectedBattalionId.value, personnelId)
    onCloseAssignToBattalionModal()
  }

  return { canHandleAssignBattalionAction, onOpenAssignBattalionAction, onCloseAssignToBattalionModal, onAssignToBattalion }
}
