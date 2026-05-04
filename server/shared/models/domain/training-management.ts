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

export interface TrainingCategoryCreate {
  code: string
  name: string
}

export interface TrainingCategoryUpdate {
  code?: string
  name?: string
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

export interface TrainingRecordListItem {
  id: string
  recordNo: string
  personnelId: string
  personnelCode: string | null
  personnelName: string | null
  trainingId: string | null
  trainingTitle: string
  trainingCategoryId: string | null
  trainingCategoryName: string | null
  levelId: string | null
  levelName: string | null
  statusId: string
  statusName: string | null
  startDate: string | null
  endDate: string | null
  certificateNo: string | null
  validUntil: string | null
  remarks: string | null
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

export interface TrainingRecordSourceRow {
  id: string
  training_title: string
  training_category_id: string | null
  level_id: string | null
  start_date: string | null
  end_date: string | null
  status_id: string
  default_remarks: string | null
}

export interface TrainingRecordReferenceRow {
  id: string
  code?: string
  name?: string
  personnel_code?: string
  full_name?: string
  last_name?: string
  first_name?: string
  middle_name?: string | null
}

export interface TrainingRecordRow {
  id: string
  record_no: string
  personnel_id: string
  training_id: string | null
  training_title: string
  training_category_id: string | null
  level_id: string | null
  start_date: string | null
  end_date: string | null
  status_id: string
  certificate_no: string | null
  valid_until: string | null
  remarks: string | null
  created_at: string
  updated_at: string
  personnel: TrainingRecordReferenceRow | TrainingRecordReferenceRow[] | null
  training_category: TrainingRecordReferenceRow | TrainingRecordReferenceRow[] | null
  level: TrainingRecordReferenceRow | TrainingRecordReferenceRow[] | null
  training_status: TrainingRecordReferenceRow | TrainingRecordReferenceRow[] | null
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
