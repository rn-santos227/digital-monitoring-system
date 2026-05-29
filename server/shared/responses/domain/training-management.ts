import type {
  UnitListResponse,
  UnitPersonnelListItem,
  TrainingCategoryListItem,
  TrainingCategorySuggestionItem,
  TrainingManagementKpiCounts,
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
export type TrainingManagementKpiApiResponse = TrainingManagementKpiCounts
export interface TrainingRecordDetailResponse extends TrainingRecordListItem {}

export interface CreateTrainingCategoryResponse {
  ok: true
  id: string
  item: TrainingCategoryListItem
}

export interface CreateTrainingResponse {
  ok: true
  id: string
  item: TrainingListItem
}

export interface CreateTrainingRecordResponse {
  ok: true
  id: string
  item: TrainingRecordListItem
}

export type TrainingPersonnelListResponse = UnitListResponse<UnitPersonnelListItem>
