import { createError } from 'h3'
import { parseNumber } from './parsers'
import { toCompactTimestamp } from './regex'
import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  EngagementTypeListItem,
  EngagementTypeRow,
  EngagementTypeSuggestionItem,
  EngagementRecordListItem,
  EngagementRecordRow,
  EngagementReferenceRow,
  EngagementListItem,
  EngagementRow,
  EngagementSuggestionItem,
} from '../models'

type LookupTable = 'levels' | 'engagement_statuses' | 'engagement_types'
type LookupColumn = 'id' | 'name'
type EngagementLookupSupabaseClient = Pick<SupabaseClient, 'from'>

const ENGAGEMENT_STATUS_NAMES = Object.freeze(['Planned', 'Ongoing', 'Completed', 'Expired', 'Cancelled'] as const)

const ENGAGEMENT_LEVEL_NAMES = Object.freeze([
  'Local',
  'National',
  'International',
])

const normalizeOptionalString = (value: unknown): string | null => {
  return typeof value === 'string' ? value : null
}

const toSingleReference = (value: EngagementReferenceRow | EngagementReferenceRow[] | null): EngagementReferenceRow | null => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

const toSingleEngagementRecordReference = (
  value: EngagementRecordRow['personnel'] | EngagementRecordRow['engagement_type'] | EngagementRecordRow['level'] | EngagementRecordRow['engagement_status'],
) => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

const toEngagementRecordPersonnelName = (personnel: EngagementRecordRow['personnel']): string | null => {
  const reference = toSingleEngagementRecordReference(personnel)

  if (!reference) {
    return null
  }

  const fullName = reference.full_name?.trim() ?? ''

  if (fullName.length > 0) {
    return fullName
  }

  const lastName = reference.last_name?.trim() ?? ''
  const firstName = reference.first_name?.trim() ?? ''
  const middleName = reference.middle_name?.trim() ?? ''
  const firstMiddle = [firstName, middleName].filter(part => part.length > 0).join(' ')
  const normalizedName = [lastName, firstMiddle].filter(part => part.length > 0).join(', ')

  return normalizedName.length > 0 ? normalizedName : null
}

export const parseEngagementSuggestionQuery = (query: {
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

export const mapEngagementTypeListItem = (row: EngagementTypeRow): EngagementTypeListItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapEngagementTypeSuggestionItem = (
  row: Pick<EngagementTypeRow, 'id' | 'code' | 'name'>,
): EngagementTypeSuggestionItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
})

export const mapEngagementListItem = (row: EngagementRow): EngagementListItem => {
  const engagementCategory = toSingleReference(row.engagement_type)
  const level = toSingleReference(row.level)
  const status = toSingleReference(row.engagement_status)

  return {
    id: row.id,
    engagementTitle: row.engagement_title,
    engagementCategoryId: row.engagement_type_id,
    engagementCategoryCode: normalizeOptionalString(engagementCategory?.code),
    engagementCategoryName: normalizeOptionalString(engagementCategory?.name),
    levelId: row.level_id,
    levelName: normalizeOptionalString(level?.name),
    startDate: normalizeOptionalString(row.start_date),
    endDate: normalizeOptionalString(row.end_date),
    statusId: row.status_id,
    statusName: normalizeOptionalString(status?.name),
    defaultRemarks: row.default_remarks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const mapEngagementSuggestionItem = (row: Pick<EngagementRow, 'id' | 'engagement_title' | 'start_date' | 'end_date' | 'engagement_type' | 'level' | 'engagement_status'>): EngagementSuggestionItem => {
  const engagementCategory = toSingleReference(row.engagement_type)
  const level = toSingleReference(row.level)
  const status = toSingleReference(row.engagement_status)

  return {
    id: row.id,
    engagementTitle: row.engagement_title,
    engagementCategoryName: normalizeOptionalString(engagementCategory?.name),
    levelName: normalizeOptionalString(level?.name),
    statusName: normalizeOptionalString(status?.name),
    startDate: normalizeOptionalString(row.start_date),
    endDate: normalizeOptionalString(row.end_date),
  }
}

export const mapEngagementRecordListItem = (row: EngagementRecordRow): EngagementRecordListItem => {
  const personnel = toSingleEngagementRecordReference(row.personnel)
  const engagementCategory = toSingleEngagementRecordReference(row.engagement_type)
  const level = toSingleEngagementRecordReference(row.level)
  const status = toSingleEngagementRecordReference(row.engagement_status)

  return {
    id: row.id,
    recordNo: row.record_no,
    personnelId: row.personnel_id,
    personnelCode: personnel?.personnel_code ?? null,
    personnelName: toEngagementRecordPersonnelName(row.personnel),
    engagementId: row.engagement_id,
    engagementTitle: row.engagement_title,
    engagementCategoryId: row.engagement_type_id,
    engagementCategoryName: engagementCategory?.name ?? null,
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

export const buildEngagementRecordNo = (): string => {
  const timestamp = toCompactTimestamp(new Date())
  const suffix = crypto.randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase()

  return `TR-${timestamp}-${suffix}`
}

export const resolveEngagementLevelId = async (supabase: EngagementLookupSupabaseClient, value: string): Promise<string> => {
  const isKnownName = ENGAGEMENT_LEVEL_NAMES.includes(value as (typeof ENGAGEMENT_LEVEL_NAMES)[number])
  const filterField: 'id' | 'name' = isKnownName ? 'name' : 'id'
  const { data, error } = await supabase
    .from('levels')
    .select('id')
    .eq(filterField as LookupColumn, value)
    .maybeSingle()

  if (error || !data?.id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid engagement level value.' })
  }

  return data.id
}

export const resolveEngagementStatusId = async (supabase: EngagementLookupSupabaseClient, value: string): Promise<string> => {
  const isKnownName = ENGAGEMENT_STATUS_NAMES.includes(value as (typeof ENGAGEMENT_STATUS_NAMES)[number])
  const filterField: 'id' | 'name' = isKnownName ? 'name' : 'id'
  const { data, error } = await supabase
    .from('engagement_statuses')
    .select('id')
    .eq(filterField as LookupColumn, value)
    .maybeSingle()

  if (error || !data?.id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid engagement status value.' })
  }

  return data.id
}

export const resolveEngagementTypeId = async (supabase: EngagementLookupSupabaseClient, value: string): Promise<string> => {
  const { data } = await supabase
    .from('engagement_types')
    .select('id')
    .eq('id', value)
    .maybeSingle()

  if (data?.id) {
    return data.id
  }

  const nameLookup = await supabase
    .from('engagement_types')
    .select('id')
    .eq('name', value)
    .maybeSingle()

  if (nameLookup.error || !nameLookup.data?.id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid engagement category value.' })
  }

  return nameLookup.data.id
}
