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
