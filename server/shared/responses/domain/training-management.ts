import type {
  UnitListResponse,
  UnitPersonnelListItem,
  TrainingCategoryListItem,
  TrainingCategorySuggestionItem,
  TrainingManagementListResponse,
  TrainingListItem,
  TrainingRecordListItem,
  TrainingSuggestionItem,
  TrainingManagementSuggestionResponse,
} from '../../models'

export type TrainingCategoryListResponse = TrainingManagementListResponse<TrainingCategoryListItem>
export type TrainingListResponse = TrainingManagementListResponse<TrainingListItem>
export type TrainingCategorySuggestionsResponse = TrainingManagementSuggestionResponse<TrainingCategorySuggestionItem>
export type TrainingSuggestionsResponse = TrainingManagementSuggestionResponse<TrainingSuggestionItem>
export type TrainingRecordListResponse = TrainingManagementListResponse<TrainingRecordListItem>
export interface TrainingRecordDetailResponse extends TrainingRecordListItem {}

export interface CreateTrainingRecordResponse {
  ok: true
  id: string
}

export type TrainingPersonnelListResponse = UnitListResponse<UnitPersonnelListItem>
