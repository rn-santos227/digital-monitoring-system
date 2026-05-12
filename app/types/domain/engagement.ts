import type {
  EngagementRecordsInsert,
  EngagementRecordsRow,
  EngagementRecordsUpdate,
  UUID,
} from '../database.tables'

export type EngagementRecordCreateInput = EngagementRecordsInsert
export type EngagementRecordUpdateInput = EngagementRecordsUpdate

export interface EngagementRecordSummary extends EngagementRecordsRow {
  personnel_code: string
  full_name: string
  engagement_type_name: string
  level_name: string | null
  engagement_status: string
}

export interface EngagementFilters {
  personnel_id?: UUID
  engagement_type_id?: UUID
  status_id?: UUID
  level_id?: UUID
  date_start_from?: string
  date_start_to?: string
}

export type CreateEngagementPayload = {
  engagement_title: string
  engagement_type_id: string
  level_id: string | null
  date_start: string | null
  date_end: string | null
  status_id: string
  default_remarks: string | null
}

export interface EngagementManagementSearchQuery {
  page?: number
  pageSize?: number
  term?: string
  fields?: string
}

export interface EngagementManagementListItem {
  id: UUID
  recordNo: string | null
  personnelName: string | null
  engagementTitle: string
  engagementCategoryName: string | null
  levelName: string | null
  statusName: string | null
  startDate: string | null
  endDate: string | null
}

export interface EngagementManagementListResponse<TItem> {
  items: TItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface CreateEngagementApiResponse {
  ok: true
  id: string
  item: EngagementManagementListItem
}

export interface CreateEngagementRecordApiResponse {
  ok: true
  id: string
  item: EngagementManagementListItem
}

export interface EngagementTablePagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
