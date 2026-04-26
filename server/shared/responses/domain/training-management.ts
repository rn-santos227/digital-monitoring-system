import type {
  TrainingCategoryListItem,
  TrainingCategorySuggestionItem,
  TrainingListItem,
  TrainingSuggestionItem,
  TrainingManagementListResponse,
  TrainingManagementSuggestionResponse,
} from '../../models'

export type TrainingCategoryListResponse = TrainingManagementListResponse<TrainingCategoryListItem>
export type TrainingListResponse = TrainingManagementListResponse<TrainingListItem>

export type TrainingCategorySuggestionsResponse = TrainingManagementSuggestionResponse<TrainingCategorySuggestionItem>

export type TrainingSuggestionsResponse = TrainingManagementSuggestionResponse<TrainingSuggestionItem>
