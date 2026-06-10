import type { Ref } from 'vue'
import { useTrainingSearchHandlers } from './search.handler'
import type {
  TrainingCategorySearchQuery,
  TrainingManagementTabId,
  TrainingRecordListItem,
  TrainingRecordSearchQuery,
  TrainingSearchQuery,
} from '~/types/domain/training'

const TRAINING_MANAGEMENT_TAB_IDS: readonly TrainingManagementTabId[] = ['records', 'trainings', 'categories']
const TRAINING_RECORD_SEARCHABLE_FIELDS = ['recordNo', 'trainingTitle', 'certificateNo', 'remarks'] as const

interface UseTrainingPageActionHandlersOptions {
  activeTab: Ref<TrainingManagementTabId>
  records: Ref<TrainingRecordListItem[]>
  selectedTrainingRecord: Ref<TrainingRecordListItem | null>
  isViewTrainingRecordModalOpen: Ref<boolean>
  onOpenCreateTrainingRecordModal: () => void
  onOpenCreateTrainingCategoryModal: () => void
  onOpenCreateTrainingModal: () => void
  onOpenUpdateTrainingRecordModal: (record: TrainingRecordListItem) => void
  onDeleteTrainingRecord: (id: string) => Promise<unknown>
  onViewTraining: (id: string) => Promise<unknown>
  onOpenUpdateTrainingModal: (id: string) => Promise<unknown>
  onDeleteTraining: (id: string) => Promise<unknown>
  onOpenUpdateTrainingCategoryModal: (id: string) => Promise<unknown>
  onDeleteTrainingCategory: (id: string) => Promise<unknown>
}

export const useTrainingManagementPageHandlers = (
  activeTab: Ref<TrainingManagementTabId>,
  recordsFilters: Ref<Partial<TrainingRecordSearchQuery>>,
  trainingFilters: Ref<Partial<TrainingSearchQuery>>,
  categoryFilters: Ref<Partial<TrainingCategorySearchQuery>>,
) => {
  const handleTabChange = (nextTab: string) => {
    if (TRAINING_MANAGEMENT_TAB_IDS.includes(nextTab as TrainingManagementTabId)) {
      activeTab.value = nextTab as TrainingManagementTabId
    }
  }

  const {
    handleRecordsFilterApply,
    handleRecordsFilterReset,
    handleTrainingFilterApply,
    handleTrainingFilterReset,
    handleCategoryFilterApply,
    handleCategoryFilterReset,
  } = useTrainingSearchHandlers(recordsFilters, trainingFilters, categoryFilters)

  return {
    handleTabChange,
    handleRecordsFilterApply,
    handleRecordsFilterReset,
    handleTrainingFilterApply,
    handleTrainingFilterReset,
    handleCategoryFilterApply,
    handleCategoryFilterReset,
  }
}

export const useTrainingPageActionHandlers = ({
  activeTab,
  records,
  selectedTrainingRecord,
  isViewTrainingRecordModalOpen,
  onOpenCreateTrainingRecordModal,
  onOpenCreateTrainingCategoryModal,
  onOpenCreateTrainingModal,
  onOpenUpdateTrainingRecordModal,
  onDeleteTrainingRecord,
  onViewTraining,
  onOpenUpdateTrainingModal,
  onDeleteTraining,
  onOpenUpdateTrainingCategoryModal,
  onDeleteTrainingCategory,
}: UseTrainingPageActionHandlersOptions) => {
  const onCreateActionClick = () => {
    if (activeTab.value === 'records') {
      onOpenCreateTrainingRecordModal()
      return
    }

    if (activeTab.value === 'categories') {
      onOpenCreateTrainingCategoryModal()
      return
    }

    if (activeTab.value === 'trainings') {
      onOpenCreateTrainingModal()
    }
  }

  const onTrainingRecordTableAction = async ({
    actionKey,
    row,
  }: {
    actionKey: string
    row: Record<string, unknown>
  }) => {
    const rowId = String(row.id ?? '')

    if (!rowId) {
      return
    }

    const selectedRecord = records.value.find(item => item.id === rowId) ?? null

    if (actionKey === 'view-training-record') {
      if (!selectedRecord) {
        return
      }

      selectedTrainingRecord.value = selectedRecord
      isViewTrainingRecordModalOpen.value = true
      return
    }

    if (actionKey === 'edit-training-record') {
      if (!selectedRecord) {
        return
      }

      onOpenUpdateTrainingRecordModal(selectedRecord)
      return
    }

    if (actionKey === 'delete-training-record') {
      await onDeleteTrainingRecord(rowId)
    }
  }

  const onTrainingTableAction = async ({
    actionKey,
    row,
  }: {
    actionKey: string
    row: Record<string, unknown>
  }) => {
    const rowId = String(row.id ?? '')

    if (!rowId) {
      return
    }

    if (actionKey === 'view-training') {
      await onViewTraining(rowId)
      return
    }

    if (actionKey === 'edit-training') {
      await onOpenUpdateTrainingModal(rowId)
      return
    }

    if (actionKey === 'delete-training') {
      await onDeleteTraining(rowId)
    }
  }

  const onCategoryTableAction = async ({
    actionKey,
    row,
  }: {
    actionKey: string
    row: Record<string, unknown>
  }) => {
    const rowId = String(row.id ?? '')

    if (!rowId) {
      return
    }
  }
}
