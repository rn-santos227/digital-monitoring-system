import type {
  PersonnelListItem,
  PersonnelProfileCompactRow,
  PersonnelProfileDetailRow,
  PersonnelProfileListRow,
} from '../models'
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
    dateEnlisted: row.date_enlisted,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

