import { createError } from 'h3'
import type {
  CreateEngagementTypeRequest,
  CreateEngagementRecordRequest,
  CreateEngagementRequest,
  UpdateEngagementRecordRequest,
  UpdateEngagementTypeRequest,
  UpdateEngagementRequest,
} from '../../requests'
import type { EngagementTypeCreate, EngagementTypeUpdate } from '../../models'
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

export const validateEngagementDateRange = (startDate: string | null, endDate: string | null): void => {
  if (!startDate || !endDate) {
    return
  }

  if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
    throw createError({ statusCode: 400, statusMessage: 'End date must be on or after start date.' })
  }
}

export const parseCreateEngagementTypePayload = (body: CreateEngagementTypeRequest): EngagementTypeCreate => {
  const code = normalizeOptionalText(body.code)?.toUpperCase()
  const name = normalizeOptionalText(body.name)

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Engagement category code is required.' })
  }

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Engagement category name is required.' })
  }

  return { code, name }
}

export const buildEngagementTypeUpdates = (body: UpdateEngagementTypeRequest): EngagementTypeUpdate => {
  const updates: EngagementTypeUpdate = {}

  if (body.code !== undefined) {
    const code = normalizeOptionalText(body.code)?.toUpperCase()

    if (!code) {
      throw createError({ statusCode: 400, statusMessage: 'Engagement category code cannot be empty.' })
    }

    updates.code = code
  }

  if (body.name !== undefined) {
    const name = normalizeOptionalText(body.name)

    if (!name) {
      throw createError({ statusCode: 400, statusMessage: 'Engagement category name cannot be empty.' })
    }

    updates.name = name
  }

  return updates
}

export const parseCreateEngagementPayload = (body: CreateEngagementRequest) => {
  const engagementTitle = normalizeOptionalText(body.engagementTitle)
  const engagementCategoryId = normalizeOptionalRelationId(body.engagementCategoryId) ?? null
  const levelId = normalizeOptionalRelationId(body.levelId) ?? null
  const startDate = normalizeOptionalDate(body.startDate)
  const endDate = normalizeOptionalDate(body.endDate)
  const statusId = normalizeOptionalText(body.statusId)
  const defaultRemarks = body.defaultRemarks === undefined ? null : normalizeOptionalText(body.defaultRemarks)

  if (!engagementTitle) {
    throw createError({ statusCode: 400, statusMessage: 'Engagement title is required.' })
  }

  if (!statusId) {
    throw createError({ statusCode: 400, statusMessage: 'Engagement status is required.' })
  }

  validateEngagementDateRange(startDate, endDate)

  return {
    engagement_title: engagementTitle,
    engagement_type_id: engagementCategoryId,
    level_id: levelId,
    start_date: startDate,
    end_date: endDate,
    status_id: statusId,
    default_remarks: defaultRemarks,
  }
}

export const buildEngagementUpdates = (body: UpdateEngagementRequest) => {
  const updates: {
    engagement_title?: string
    engagement_type_id?: string | null
    level_id?: string | null
    start_date?: string | null
    end_date?: string | null
    status_id?: string
    default_remarks?: string | null
  } = {}

  if (body.engagementTitle !== undefined) {
    const engagementTitle = normalizeOptionalText(body.engagementTitle)

    if (!engagementTitle) {
      throw createError({ statusCode: 400, statusMessage: 'Engagement title cannot be empty.' })
    }

    updates.engagement_title = engagementTitle
  }

  if (body.engagementCategoryId !== undefined) {
    updates.engagement_type_id = normalizeOptionalRelationId(body.engagementCategoryId) ?? null
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
      throw createError({ statusCode: 400, statusMessage: 'Engagement status cannot be empty.' })
    }

    updates.status_id = statusId
  }

  if (body.defaultRemarks !== undefined) {
    updates.default_remarks = normalizeOptionalText(body.defaultRemarks)
  }

  const effectiveStartDate = updates.start_date ?? null
  const effectiveEndDate = updates.end_date ?? null

  if (updates.start_date !== undefined || updates.end_date !== undefined) {
    validateEngagementDateRange(effectiveStartDate, effectiveEndDate)
  }

  return updates
}

export const parseCreateEngagementRecordPayload = (body: CreateEngagementRecordRequest) => {
  const engagementId = normalizeOptionalText(body.engagementId)
  const personnelId = normalizeOptionalText(body.personnelId)
  const certificateNo = body.certificateNo === undefined ? null : normalizeOptionalText(body.certificateNo)
  const validUntil = normalizeOptionalDate(body.validUntil)
  const remarks = body.remarks === undefined ? null : normalizeOptionalText(body.remarks)

  if (!engagementId) {
    throw createError({ statusCode: 400, statusMessage: 'Engagement id is required.' })
  }

  if (!personnelId) {
    throw createError({ statusCode: 400, statusMessage: 'Personnel id is required.' })
  }

  return {
    engagement_id: engagementId,
    personnel_id: personnelId,
    certificate_no: certificateNo,
    valid_until: validUntil,
    remarks,
  }
}

export const buildEngagementRecordUpdates = (body: UpdateEngagementRecordRequest) => {
  const updates: {
    engagement_id?: string
    personnel_id?: string
    certificate_no?: string | null
    valid_until?: string | null
    remarks?: string | null
  } = {}

  if (body.engagementId !== undefined) {
    const engagementId = normalizeOptionalText(body.engagementId)

    if (!engagementId) {
      throw createError({ statusCode: 400, statusMessage: 'Engagement id cannot be empty.' })
    }

    updates.engagement_id = engagementId
  }

  if (body.personnelId !== undefined) {
    const personnelId = normalizeOptionalText(body.personnelId)

    if (!personnelId) {
      throw createError({ statusCode: 400, statusMessage: 'Personnel id cannot be empty.' })
    }

    updates.personnel_id = personnelId
  }

  if (body.certificateNo !== undefined) {
    updates.certificate_no = normalizeOptionalText(body.certificateNo)
  }

  if (body.validUntil !== undefined) {
    updates.valid_until = normalizeOptionalDate(body.validUntil)
  }

  if (body.remarks !== undefined) {
    updates.remarks = normalizeOptionalText(body.remarks)
  }

  return updates
}
