export interface CreateTrainingCategoryRequest {
  code?: string
  name?: string
}

export interface UpdateTrainingCategoryRequest {
  code?: string
  name?: string
}

export interface CreateTrainingRequest {
  trainingTitle?: string
  trainingCategoryId?: string | null
  levelId?: string | null
  startDate?: string | null
  endDate?: string | null
  statusId?: string
  defaultRemarks?: string | null
}

export interface UpdateTrainingRequest {
  trainingTitle?: string
  trainingCategoryId?: string | null
  levelId?: string | null
  startDate?: string | null
  endDate?: string | null
  statusId?: string
  defaultRemarks?: string | null
}
