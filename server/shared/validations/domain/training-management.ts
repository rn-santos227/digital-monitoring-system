import { createError } from 'h3'
import type {
  CreateTrainingCategoryRequest,
  CreateTrainingRequest,
  UpdateTrainingCategoryRequest,
  UpdateTrainingRequest,
} from '../../requests'
import { normalizeOptionalText } from '../../utils'

const normalizeOptionalDate = (value: unknown): string | null => {
  if (value === null) {
    return null
  }

  const normalized = normalizeOptionalText(value)

  if (!normalized) {
    return null
  }

  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) {
    throw createError({ statusCode: 400, statusMessage: `Invalid date value: ${normalized}` })
  }

  return normalized
}

const normalizeOptionalRelationId = (value: unknown): string | null | undefined => {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  return normalizeOptionalText(value)
}

const ensureDateRange = (startDate: string | null, endDate: string | null) => {
  if (!startDate || !endDate) {
    return
  }

  if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
    throw createError({ statusCode: 400, statusMessage: 'End date must be on or after start date.' })
  }
}

export const parseCreateTrainingCategoryPayload = (body: CreateTrainingCategoryRequest) => {
  const code = normalizeOptionalText(body.code)?.toUpperCase()
  const name = normalizeOptionalText(body.name)

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Training category code is required.' })
  }

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Training category name is required.' })
  }

  return { code, name }
}

export const buildTrainingCategoryUpdates = (body: UpdateTrainingCategoryRequest) => {
  const updates: {
    code?: string
    name?: string
  } = {}

  if (body.code !== undefined) {
    const code = normalizeOptionalText(body.code)?.toUpperCase()

    if (!code) {
      throw createError({ statusCode: 400, statusMessage: 'Training category code cannot be empty.' })
    }

    updates.code = code
  }

  if (body.name !== undefined) {
    const name = normalizeOptionalText(body.name)

    if (!name) {
      throw createError({ statusCode: 400, statusMessage: 'Training category name cannot be empty.' })
    }

    updates.name = name
  }

  return updates
}

export const parseCreateTrainingPayload = (body: CreateTrainingRequest) => {
  const trainingTitle = normalizeOptionalText(body.trainingTitle)
  const trainingCategoryId = normalizeOptionalRelationId(body.trainingCategoryId) ?? null
  const levelId = normalizeOptionalRelationId(body.levelId) ?? null
  const startDate = normalizeOptionalDate(body.startDate)
  const endDate = normalizeOptionalDate(body.endDate)
  const statusId = normalizeOptionalText(body.statusId)
  const defaultRemarks = body.defaultRemarks === undefined ? null : normalizeOptionalText(body.defaultRemarks)

  if (!trainingTitle) {
    throw createError({ statusCode: 400, statusMessage: 'Training title is required.' })
  }

  if (!statusId) {
    throw createError({ statusCode: 400, statusMessage: 'Training status is required.' })
  }

  ensureDateRange(startDate, endDate)

  return {
    training_title: trainingTitle,
    training_category_id: trainingCategoryId,
    level_id: levelId,
    start_date: startDate,
    end_date: endDate,
    status_id: statusId,
    default_remarks: defaultRemarks,
  }
}

export const buildTrainingUpdates = (body: UpdateTrainingRequest) => {
  const updates: {
    training_title?: string
    training_category_id?: string | null
    level_id?: string | null
    start_date?: string | null
    end_date?: string | null
    status_id?: string
    default_remarks?: string | null
  } = {}

  if (body.trainingTitle !== undefined) {
    const trainingTitle = normalizeOptionalText(body.trainingTitle)

    if (!trainingTitle) {
      throw createError({ statusCode: 400, statusMessage: 'Training title cannot be empty.' })
    }

    updates.training_title = trainingTitle
  }

  if (body.trainingCategoryId !== undefined) {
    updates.training_category_id = normalizeOptionalRelationId(body.trainingCategoryId) ?? null
  }

  if (body.levelId !== undefined) {
    updates.level_id = normalizeOptionalRelationId(body.levelId) ?? null
  }

  if (body.startDate !== undefined) {
    updates.start_date = normalizeOptionalDate(body.startDate)
  }

  if (body.endDate !== undefined) {
    updates.end_date = normalizeOptionalDate(body.endDate)
  }

  if (body.statusId !== undefined) {
    const statusId = normalizeOptionalText(body.statusId)

    if (!statusId) {
      throw createError({ statusCode: 400, statusMessage: 'Training status cannot be empty.' })
    }

    updates.status_id = statusId
  }

  if (body.defaultRemarks !== undefined) {
    updates.default_remarks = normalizeOptionalText(body.defaultRemarks)
  }

  const effectiveStartDate = updates.start_date ?? null
  const effectiveEndDate = updates.end_date ?? null

  if (updates.start_date !== undefined || updates.end_date !== undefined) {
    ensureDateRange(effectiveStartDate, effectiveEndDate)
  }

  return updates
}
