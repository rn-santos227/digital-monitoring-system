import { parseNumber } from './parsers'
import type {
  TrainingCategoryListItem,
  TrainingCategoryRow,
  TrainingCategorySuggestionItem,
  TrainingReferenceRow,
  TrainingListItem,
  TrainingRow,
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
