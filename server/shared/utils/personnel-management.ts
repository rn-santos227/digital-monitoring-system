import { createError } from 'h3'
import type { PersonnelListItem } from '../models'
import type { PersonnelDetailResponse, PersonnelListItemCompact } from '../responses'

interface PersonnelProfileRow {
  id: string
  personnel_code: string
  service_number: string
  last_name: string
  first_name: string
  middle_name: string | null
  full_name: string
  sex: 'Male' | 'Female'
  rank_id: string
  rank_code: string
  rank_name: string
  company_id: string | null
  company_code: string | null
  company_name: string | null
  battalion_id: string | null
  battalion_code: string | null
  battalion_name: string | null
  employment_status_id: string
  employment_status: string
  service_status_id: string
  service_status: string
  contact_number: string | null
  birthdate: string | null
  date_enlisted: string | null
  created_at: string
  updated_at: string
}

export const mapPersonnelListItem = (row: PersonnelProfileRow): PersonnelListItem => {
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

export const mapPersonnelCompactListItem = (row: PersonnelProfileRow): PersonnelListItemCompact => {
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

export const mapPersonnelDetail = (row: PersonnelProfileRow): PersonnelDetailResponse => {
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


export const getPersonnelReferenceCount = async (args: {
  supabase: {
    from: (table: string) => {
      select: (
        columns: string,
        options: { count: 'exact'; head: true },
      ) => {
        eq: (column: string, value: string) => Promise<{ count: number | null; error: { message: string } | null }>
      }
    }
  }
  table: string
  column: string
  id: string
}): Promise<number> => {
  const { count, error } = await args.supabase
    .from(args.table)
    .select('id', { count: 'exact', head: true })
    .eq(args.column, args.id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to check ${args.table} references: ${error.message}` })
  }

  return count ?? 0
}
