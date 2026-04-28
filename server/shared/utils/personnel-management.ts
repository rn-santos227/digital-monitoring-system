import type {
  PersonnelListItem,
  PersonnelProfileCompactRow,
  PersonnelProfileDetailRow,
  PersonnelProfileListRow,
} from '../models'
import { createError } from 'h3'
import { parseNumber } from './parsers'
import type { PersonnelDetailResponse, PersonnelListItemCompact, PersonnelSuggestionItem } from '../responses'

interface PersonnelSuggestionRow {
  id: string
  personnel_code: string
  service_number: string
  full_name: string
  rank_name: string
  company_name: string | null
  battalion_name: string | null
  service_status: string
}


const EMPLOYMENT_STATUS_NAMES = ['Regular', 'Contractual', 'Probationary', 'Separated'] as const
const SERVICE_STATUS_NAMES = [
  'Active Duty',
  'Deployed',
  'Unavailable',
  'Standby-Alert',
  'Injured',
  'Dead',
  'Reserve',
  'Detached',
  'On Leave',
  'Retired',
] as const

interface PersonnelStatusLookupSupabaseClient {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
      }
    }
  }
}

export const parsePersonnelSuggestionQuery = (query: {
  term?: unknown
  pageSize?: unknown
  selectedPersonnelId?: unknown
}) => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const selectedPersonnelId = typeof query.selectedPersonnelId === 'string' && query.selectedPersonnelId.length > 0
    ? query.selectedPersonnelId
    : null
  const rawPageSize = Math.trunc(parseNumber(query.pageSize, 10))
  const pageSize = Math.min(Math.max(rawPageSize, 1), 20)

  return {
    term,
    pageSize,
    selectedPersonnelId,
  }
}

export const mapPersonnelSuggestionItem = (
  row: PersonnelSuggestionRow,
  suggestedEmail: string | null
): PersonnelSuggestionItem => {
  return {
    id: row.id,
    personnelCode: row.personnel_code,
    serviceNumber: row.service_number,
    fullName: row.full_name,
    rankName: row.rank_name,
    companyName: row.company_name,
    battalionName: row.battalion_name,
    serviceStatus: row.service_status,
    suggestedEmail,
  }
}

export const mapPersonnelListItem = (row: PersonnelProfileListRow): PersonnelListItem => {
  return {
    id: row.id,
    personnelCode: row.personnel_code,
    serviceNumber: row.service_number,
    fullName: row.full_name,
    sex: row.sex,
    rankName: row.rank_name,
    companyName: row.company_name,
    battalionName: row.battalion_name,
    employmentStatus: row.employment_status,
    serviceStatus: row.service_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const mapPersonnelCompactListItem = (row: PersonnelProfileCompactRow): PersonnelListItemCompact => {
  return {
    id: row.id,
    personnelCode: row.personnel_code,
    serviceNumber: row.service_number,
    fullName: row.full_name,
    rankName: row.rank_name,
    companyName: row.company_name,
    battalionName: row.battalion_name,
    serviceStatus: row.service_status,
  }
}

export const mapPersonnelDetail = (row: PersonnelProfileDetailRow): PersonnelDetailResponse => {
  const age = row.birthdate
    ? Math.max(0, new Date().getUTCFullYear() - new Date(row.birthdate).getUTCFullYear() - (new Date().toISOString().slice(5, 10) < row.birthdate.slice(5, 10) ? 1 : 0))
    : null

  return {
    id: row.id,
    personnelCode: row.personnel_code,
    serviceNumber: row.service_number,
    lastName: row.last_name,
    firstName: row.first_name,
    middleName: row.middle_name,
    sex: row.sex,
    birthdate: row.birthdate,
    rankId: row.rank_id,
    rankCode: row.rank_code,
    rankName: row.rank_name,
    companyId: row.company_id,
    companyCode: row.company_code,
    companyName: row.company_name,
    battalionId: row.battalion_id,
    battalionCode: row.battalion_code,
    battalionName: row.battalion_name,
    employmentStatusId: row.employment_status_id,
    employmentStatus: row.employment_status,
    serviceStatusId: row.service_status_id,
    serviceStatus: row.service_status,
    contactNumber: row.contact_number,
    position: row.position,
    dateEnlisted: row.date_enlisted,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    age,
  }
}

export const resolvePersonnelEmploymentStatusId = async (supabase: unknown, value: string): Promise<string> => {
  const supabaseClient = supabase as PersonnelStatusLookupSupabaseClient
  const isKnownName = EMPLOYMENT_STATUS_NAMES.includes(value as (typeof EMPLOYMENT_STATUS_NAMES)[number])
  const filterField = isKnownName ? 'name' : 'id'
  const { data, error } = await supabaseClient
    .from('employment_statuses')
    .select('id')
    .eq(filterField, value)
    .maybeSingle()

  if (error || !data?.id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid employment status value.' })
  }

  return data.id
}

export const resolvePersonnelServiceStatusId = async (supabase: unknown, value: string): Promise<string> => {
  const supabaseClient = supabase as PersonnelStatusLookupSupabaseClient
  const isKnownName = SERVICE_STATUS_NAMES.includes(value as (typeof SERVICE_STATUS_NAMES)[number])
  const filterField = isKnownName ? 'name' : 'id'
  const { data, error } = await supabaseClient
    .from('service_statuses')
    .select('id')
    .eq(filterField, value)
    .maybeSingle()

  if (error || !data?.id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid service status value.' })
  }

  return data.id
}
