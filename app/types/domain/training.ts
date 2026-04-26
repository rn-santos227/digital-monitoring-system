import type {
  TrainingRecordsInsert,
  TrainingRecordsRow,
  TrainingRecordsUpdate,
  UUID,
} from '../database.tables'

export type TrainingRecordCreateInput = TrainingRecordsInsert
export type TrainingRecordUpdateInput = TrainingRecordsUpdate

export interface TrainingRecordSummary extends TrainingRecordsRow {
  personnel_code: string
  full_name: string
  training_category_code: string | null
  training_category_name: string | null
  level_name: string | null
  training_status: string
}

export interface TrainingFilters {
  personnel_id?: UUID
  training_category_id?: UUID
  level_id?: UUID
  status_id?: UUID
  start_date_from?: string
  start_date_to?: string
}

export type TrainingManagementTabId = 'records' | 'trainings' | 'categories'

export interface TrainingListItem {
  id: string
  trainingTitle: string
  trainingCategoryName: string | null
  levelName: string | null
  statusName: string | null
  startDate: string | null
  endDate: string | null
  defaultRemarks: string | null
}

export interface TrainingSuggestionItem {
  id: string
  trainingTitle: string
  trainingCategoryName: string | null
  levelName: string | null
  statusName: string | null
  startDate: string | null
  endDate: string | null
}

export interface TrainingCategoryListItem {
  id: string
  code: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface TrainingManagementListResponse<TItem> {
  items: TItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface TrainingSuggestionResponse<TItem> {
  items: TItem[]
}

export interface TrainingEndpointQuery {
  page?: number
  pageSize?: number
  search?: string
}

export interface CreateTrainingPayload {
  trainingTitle: string
  trainingCategoryId: string | null
  statusId: string
  levelId?: string | null
  startDate?: string | null
  endDate?: string | null
  defaultRemarks?: string | null
}

export interface CreateTrainingCategoryPayload {
  code: string
  name: string
}

export interface TrainingSearchQuery extends TrainingEndpointQuery {
  term?: string
  fields?: string
  trainingCategoryId?: string
  statusId?: string
}

export interface TrainingCategoryEndpointQuery {
  page?: number
  pageSize?: number
  search?: string
}

export interface TrainingCategorySearchQuery extends TrainingCategoryEndpointQuery {
  term?: string
  fields?: string
}

export interface TrainingTablePagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface TrainingsState {
  items: TrainingListItem[]
  pagination: TrainingTablePagination
  isLoading: boolean
  error: string
}

export interface TrainingCategoriesState {
  items: TrainingCategoryListItem[]
  pagination: TrainingTablePagination
  isLoading: boolean
  error: string
}
