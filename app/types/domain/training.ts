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
