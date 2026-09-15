import type {
  EngagementRecordsInsert,
  EngagementRecordsRow,
  EngagementRecordsUpdate,
  UUID,
} from '../database.tables'
import type {
  AdvancedSearchCondition,
  AdvancedSearchMatch,
} from '~/constants/ui.constants'

export type EngagementRecordsTabId = 'records' | 'engagements' | 'calendar'

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
  start_date: string | null
  end_date: string | null
  status_id: string
  default_remarks: string | null
}

export type CreateEngagementRecordPayload = {
  personnel_id: string
  engagement_id: string
  role: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  remarks: string | null
}

export interface EngagementManagementSearchQuery {
  page?: number
  pageSize?: number
  term?: string
  fields?: string
  conditions?: string
  match?: AdvancedSearchMatch
}

export type EngagementSearchCondition = AdvancedSearchCondition

export interface EngagementManagementListItem {
  id: UUID
  recordNo: string | null
  personnelId?: string | null
  personnelName: string | null
  personnelCode?: string | null
  engagementId?: string | null
  engagementTitle: string
  engagementCategoryName: string | null
  engagementCategoryId?: string | null
  engagementTypeId?: string | null
  levelName: string | null
  levelId?: string | null
  statusName: string | null
  statusId?: string | null
  startDate: string | null
  endDate: string | null
  role?: string | null
  location?: string | null
  remarks?: string | null
  defaultRemarks?: string | null
}

export interface EngagementPersonnelListItem {
  id: string
  personnelCode: string | null
  serviceNumber: string | null
  fullName: string | null
  rankName: string | null
  serviceStatus: string | null
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

export interface EngagementManagementKpiCounts {
  totalEngagements: number
  totalEngagementRecords: number
}

export type EngagementBulkUpdateValues = Partial<{
  start_date: string | null
  end_date: string | null
  role: string | null
  remarks: string | null
  default_remarks: string | null
}>
