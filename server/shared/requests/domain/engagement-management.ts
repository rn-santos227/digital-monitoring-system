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
  engagement_title?: string
  engagementCategoryId?: string | null
  engagement_type_id?: string | null
  levelId?: string | null
  level_id?: string | null
  startDate?: string | null
  start_date?: string | null
  endDate?: string | null
  end_date?: string | null
  statusId?: string
  status_id?: string
  defaultRemarks?: string | null
  default_remarks?: string | null
}

export interface UpdateEngagementRequest {
  engagementTitle?: string
  engagement_title?: string
  engagementCategoryId?: string | null
  engagement_type_id?: string | null
  levelId?: string | null
  level_id?: string | null
  startDate?: string | null
  start_date?: string | null
  endDate?: string | null
  end_date?: string | null
  statusId?: string
  status_id?: string
  defaultRemarks?: string | null
  default_remarks?: string | null
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
