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
