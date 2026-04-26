export interface TrainingCategoryListItem {
  id: string
  code: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface TrainingCategoryRow {
  id: string
  code: string
  name: string
  created_at: string
  updated_at: string
}

export interface TrainingCategorySuggestionItem {
  id: string
  code: string
  name: string
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

export interface TrainingListItem {
  id: string
  trainingTitle: string
  trainingCategoryId: string | null
  trainingCategoryCode: string | null
  trainingCategoryName: string | null
  levelId: string | null
  levelName: string | null
  startDate: string | null
  endDate: string | null
  statusId: string
  statusName: string | null
  defaultRemarks: string | null
  createdAt: string
  updatedAt: string
}

export interface TrainingReferenceRow {
  id: string
  code?: string
  name: string
}

export interface TrainingRow {
  id: string
  training_title: string
  training_category_id: string | null
  level_id: string | null
  start_date: string | null
  end_date: string | null
  status_id: string
  default_remarks: string | null
  created_at: string
  updated_at: string
  training_category: TrainingReferenceRow | TrainingReferenceRow[] | null
  level: TrainingReferenceRow | TrainingReferenceRow[] | null
  training_status: TrainingReferenceRow | TrainingReferenceRow[] | null
}

export interface TrainingManagementListResponse<TItem> {
  items: TItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface TrainingManagementSuggestionResponse<TItem> {
  items: TItem[]
}
