import type {
  TrainingCategoryListItem,
  TrainingCategorySuggestionItem,
  TrainingListItem,
  TrainingManagementListResponse,
  TrainingManagementSuggestionResponse,
} from '../../models'

export type TrainingCategoryListResponse = TrainingManagementListResponse<TrainingCategoryListItem>
export type TrainingListResponse = TrainingManagementListResponse<TrainingListItem>

export type TrainingCategorySuggestionsResponse = TrainingManagementSuggestionResponse<TrainingCategorySuggestionItem>
