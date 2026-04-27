import { parseNumber } from './parsers'
import type {
  TrainingCategoryListItem,
  TrainingCategoryRow,
  TrainingCategorySuggestionItem,
  TrainingRecordListItem,
  TrainingRecordRow,
  TrainingReferenceRow,
  TrainingListItem,
  TrainingRow,
  TrainingSuggestionItem,
} from '../models'

const toSingleReference = (value: TrainingReferenceRow | TrainingReferenceRow[] | null): TrainingReferenceRow | null => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

const toSingleTrainingRecordReference = (
  value: TrainingRecordRow['personnel'] | TrainingRecordRow['training_category'] | TrainingRecordRow['level'] | TrainingRecordRow['training_status'],
) => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

export const parseTrainingSuggestionQuery = (query: {
  term?: unknown
  pageSize?: unknown
  selectedId?: unknown
}) => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const selectedId = typeof query.selectedId === 'string' && query.selectedId.length > 0 ? query.selectedId : null
  const rawPageSize = Math.trunc(parseNumber(query.pageSize, 10))
  const pageSize = Math.min(Math.max(rawPageSize, 1), 20)

  return {
    term,
    pageSize,
    selectedId,
  }
}

export const mapTrainingCategoryListItem = (row: TrainingCategoryRow): TrainingCategoryListItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapTrainingCategorySuggestionItem = (
  row: Pick<TrainingCategoryRow, 'id' | 'code' | 'name'>,
): TrainingCategorySuggestionItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
})

export const mapTrainingListItem = (row: TrainingRow): TrainingListItem => {
  const trainingCategory = toSingleReference(row.training_category)
  const level = toSingleReference(row.level)
  const status = toSingleReference(row.training_status)

  return {
    id: row.id,
    trainingTitle: row.training_title,
    trainingCategoryId: row.training_category_id,
    trainingCategoryCode: trainingCategory?.code ?? null,
    trainingCategoryName: trainingCategory?.name ?? null,
    levelId: row.level_id,
    levelName: level?.name ?? null,
    startDate: row.start_date,
    endDate: row.end_date,
    statusId: row.status_id,
    statusName: status?.name ?? null,
    defaultRemarks: row.default_remarks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const mapTrainingSuggestionItem = (row: Pick<TrainingRow, 'id' | 'training_title' | 'start_date' | 'end_date' | 'training_category' | 'level' | 'training_status'>): TrainingSuggestionItem => {
  const trainingCategory = toSingleReference(row.training_category)
  const level = toSingleReference(row.level)
  const status = toSingleReference(row.training_status)

  return {
    id: row.id,
    trainingTitle: row.training_title,
    trainingCategoryName: trainingCategory?.name ?? null,
    levelName: level?.name ?? null,
    statusName: status?.name ?? null,
    startDate: row.start_date,
    endDate: row.end_date,
  }
}

export const mapTrainingRecordListItem = (row: TrainingRecordRow): TrainingRecordListItem => {
  const personnel = toSingleTrainingRecordReference(row.personnel)
  const trainingCategory = toSingleTrainingRecordReference(row.training_category)
  const level = toSingleTrainingRecordReference(row.level)
  const status = toSingleTrainingRecordReference(row.training_status)

  return {
    id: row.id,
    recordNo: row.record_no,
    personnelId: row.personnel_id,
    personnelCode: personnel?.personnel_code ?? null,
    personnelName: personnel?.full_name ?? null,
    trainingId: row.training_id,
    trainingTitle: row.training_title,
    trainingCategoryId: row.training_category_id,
    trainingCategoryName: trainingCategory?.name ?? null,
    levelId: row.level_id,
    levelName: level?.name ?? null,
    statusId: row.status_id,
    statusName: status?.name ?? null,
    startDate: row.start_date,
    endDate: row.end_date,
    certificateNo: row.certificate_no,
    validUntil: row.valid_until,
    remarks: row.remarks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const buildTrainingRecordNo = (): string => {
  const timestamp = new Date().toISOString().replaceAll(/[^0-9]/g, '').slice(0, 14)
  const suffix = crypto.randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase()

  return `TR-${timestamp}-${suffix}`
}
