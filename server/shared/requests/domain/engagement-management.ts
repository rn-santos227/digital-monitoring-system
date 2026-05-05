export interface CreateEngagementTypeRequest {
  code?: string
  name?: string
}

export interface UpdateEngagementTypeRequest {
  code?: string
  name?: string
}

export interface CreateEngagementRequest {
  engagementTitle?: string
  engagementCategoryId?: string | null
  levelId?: string | null
  startDate?: string | null
  endDate?: string | null
  statusId?: string
  defaultRemarks?: string | null
}

export interface UpdateEngagementRequest {
  engagementTitle?: string
  engagementCategoryId?: string | null
  levelId?: string | null
  startDate?: string | null
  endDate?: string | null
  statusId?: string
  defaultRemarks?: string | null
}

export interface CreateEngagementRecordRequest {
  engagementId?: string
  personnelId?: string
  certificateNo?: string | null
  validUntil?: string | null
  remarks?: string | null
}

export interface UpdateEngagementRecordRequest {
  engagementId?: string | null
  personnelId?: string
  certificateNo?: string | null
  validUntil?: string | null
  remarks?: string | null
}
