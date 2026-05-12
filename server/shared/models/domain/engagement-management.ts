export interface EngagementTypeListItem {
  id: string
  code: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface EngagementCreate {
  engagement_title: string
  engagement_type_id: string | null
  level_id: string | null
  start_date: string | null
  end_date: string | null
  status_id: string
  default_remarks: string | null
  created_by: string
}

export interface EngagementUpdate {
  engagement_title: string
  engagement_type_id: string | null
  level_id: string | null
  start_date: string | null
  end_date: string | null
  status_id: string
  default_remarks: string | null
}

export interface EngagementTypeRow {
  id: string
  code: string
  name: string
  created_at: string
  updated_at: string
}

export interface EngagementTypeCreate {
  code: string
  name: string
}

export interface EngagementTypeUpdate {
  code?: string
  name?: string
}

export interface EngagementTypeSuggestionItem {
  id: string
  code: string
  name: string
}

export interface EngagementSuggestionItem {
  id: string
  engagementTitle: string
  engagementCategoryName: string | null
  levelName: string | null
  statusName: string | null
  startDate: string | null
  endDate: string | null
}

export interface EngagementListItem {
  id: string
  engagementTitle: string
  engagementCategoryId: string | null
  engagementCategoryCode: string | null
  engagementCategoryName: string | null
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

export interface EngagementRecordListItem {
  id: string
  recordNo: string
  personnelId: string
  personnelCode: string | null
  personnelName: string | null
  engagementId: string | null
  engagementTitle: string
  engagementCategoryId: string | null
  engagementCategoryName: string | null
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

export interface EngagementReferenceRow {
  id: string
  code?: string
  name: string
}

export interface EngagementRow {
  id: string
  engagement_title: string
  engagement_type_id: string | null
  level_id: string | null
  start_date: string | null
  end_date: string | null
  status_id: string
  default_remarks: string | null
  created_at: string
  updated_at: string
  engagement_type: EngagementReferenceRow | EngagementReferenceRow[] | null
  level: EngagementReferenceRow | EngagementReferenceRow[] | null
  engagement_status: EngagementReferenceRow | EngagementReferenceRow[] | null
}

export interface EngagementRecordSourceRow {
  id: string
  engagement_title: string
  engagement_type_id: string | null
  level_id: string | null
  start_date: string | null
  end_date: string | null
  status_id: string
  default_remarks: string | null
}

export interface EngagementRecordCreate {
  record_no: string
  personnel_id: string
  engagement_id: string
  engagement_title: string
  engagement_type_id: string | null
  level_id: string | null
  start_date: string | null
  end_date: string | null
  status_id: string
  certificate_no: string | null
  valid_until: string | null
  remarks: string | null
}

export interface EngagementRecordUpdate {
  engagement_id: string
  engagement_title: string
  engagement_type_id: string | null
  level_id: string | null
  start_date: string | null
  end_date: string | null
  status_id: string
  personnel_id: string
  certificate_no: string | null
  valid_until: string | null
  remarks: string | null
}

export interface EngagementRecordReferenceRow {
  id: string
  code?: string
  name?: string
  personnel_code?: string
  full_name?: string
  last_name?: string
  first_name?: string
  middle_name?: string | null
}

export interface EngagementRecordRow {
  id: string
  record_no: string
  personnel_id: string
  engagement_id: string | null
  engagement_title: string
  engagement_type_id: string | null
  level_id: string | null
  start_date: string | null
  end_date: string | null
  status_id: string
  certificate_no: string | null
  valid_until: string | null
  remarks: string | null
  created_at: string
  updated_at: string
  personnel: EngagementRecordReferenceRow | EngagementRecordReferenceRow[] | null
  engagement_type: EngagementRecordReferenceRow | EngagementRecordReferenceRow[] | null
  level: EngagementRecordReferenceRow | EngagementRecordReferenceRow[] | null
  engagement_status: EngagementRecordReferenceRow | EngagementRecordReferenceRow[] | null
}

export interface EngagementManagementListResponse<TItem> {
  items: TItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface EngagementManagementSuggestionResponse<TItem> {
  items: TItem[]
}
