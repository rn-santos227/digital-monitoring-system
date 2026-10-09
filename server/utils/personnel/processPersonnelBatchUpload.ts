import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { PersonnelBatchUploadRowRequest } from '../../shared/requests'
import { parseCreatePersonnelPayload } from '../../shared/validation'

type RankLookupRow = { id: string, code: string | null }
type StatusLookupRow = { id: string, name: string }
type BattalionLookupRow = { id: string, code: string }
type CompanyLookupRow = { id: string, code: string, battalion_id: string | null }

const normalize = (value: string): string => value.trim()

export const processPersonnelBatchUpload = async (
  supabase: SupabaseClient,
  parsedRows: PersonnelBatchUploadRowRequest[],
): Promise<number> => {
  const payloads = parsedRows.map((row) => parseCreatePersonnelPayload({
    ...row,
    dateEnlisted: row.dateEnlisted ?? new Date().toISOString().slice(0, 10),
  }))

  const [
    { data: ranks, error: ranksError },
    { data: employmentStatuses, error: employmentStatusesError },
    { data: serviceStatuses, error: serviceStatusesError },
    { data: battalions, error: battalionsError },
    { data: companies, error: companiesError },
  ] = await Promise.all([
    supabase.from('ranks').select('id,code'),
    supabase.from('employment_statuses').select('id,name'),
    supabase.from('service_statuses').select('id,name'),
    supabase.from('battalions').select('id,code'),
    supabase.from('companies').select('id,code,battalion_id'),
  ])

  if (ranksError || employmentStatusesError || serviceStatusesError || battalionsError || companiesError) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to load reference data for personnel batch upload.' })
  }

  const rankRows = (ranks ?? []) as RankLookupRow[]
  const employmentRows = (employmentStatuses ?? []) as StatusLookupRow[]
  const serviceRows = (serviceStatuses ?? []) as StatusLookupRow[]
  const battalionRows = (battalions ?? []) as BattalionLookupRow[]
  const companyRows = (companies ?? []) as CompanyLookupRow[]

  const rankById = new Map(rankRows.map((row) => [row.id, row.id]))
  const rankByCode = new Map(rankRows.filter((row) => row.code).map((row) => [normalize(row.code ?? ''), row.id]))
  const employmentById = new Map(employmentRows.map((row) => [row.id, row.id]))
  const employmentByName = new Map(employmentRows.map((row) => [normalize(row.name), row.id]))
  const serviceById = new Map(serviceRows.map((row) => [row.id, row.id]))
  const serviceByName = new Map(serviceRows.map((row) => [normalize(row.name), row.id]))
  const battalionById = new Map(battalionRows.map((row) => [row.id, row.id]))
  const battalionByCode = new Map(battalionRows.map((row) => [normalize(row.code), row.id]))
  const companyById = new Map(companyRows.map((row) => [row.id, row]))
  const companyByCode = new Map(companyRows.map((row) => [normalize(row.code), row]))

  for (const payload of payloads) {
    const rankId = rankById.get(payload.rank_id) ?? rankByCode.get(normalize(payload.rank_id))
    if (!rankId) {
      throw createError({ statusCode: 400, statusMessage: `Invalid rank value for service number ${payload.service_number}.` })
    }
    payload.rank_id = rankId

    const employmentStatusId = employmentById.get(payload.employment_status_id)
      ?? employmentByName.get(normalize(payload.employment_status_id))
    if (!employmentStatusId) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid employment status value.' })
    }
    payload.employment_status_id = employmentStatusId

    const serviceStatusId = serviceById.get(payload.service_status_id)
      ?? serviceByName.get(normalize(payload.service_status_id))
    if (!serviceStatusId) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid service status value.' })
    }
    payload.service_status_id = serviceStatusId

    if (payload.battalion_id) {
      const battalionId = battalionById.get(payload.battalion_id)
        ?? battalionByCode.get(normalize(payload.battalion_id))
      if (!battalionId) {
        throw createError({ statusCode: 400, statusMessage: `Invalid battalion value for service number ${payload.service_number}.` })
      }
      payload.battalion_id = battalionId
    }

    if (payload.company_id) {
      const company = companyById.get(payload.company_id)
        ?? companyByCode.get(normalize(payload.company_id))
      if (!company) {
        throw createError({ statusCode: 400, statusMessage: `Invalid company value for service number ${payload.service_number}.` })
      }

      payload.company_id = company.id
      payload.battalion_id = payload.battalion_id ?? company.battalion_id ?? null
    }

    if (payload.company_id && payload.battalion_id) {
      const resolvedCompany = companyById.get(payload.company_id)
      if (!resolvedCompany) {
        throw createError({ statusCode: 404, statusMessage: 'Company not found.' })
      }
      if (resolvedCompany.battalion_id !== payload.battalion_id) {
        throw createError({ statusCode: 400, statusMessage: 'Company must belong to the selected battalion.' })
      }
    }
  }

  const { error: insertError } = await supabase
    .from('personnel')
    .insert(payloads)

  if (insertError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create personnel records: ${insertError.message}` })
  }

  return payloads.length
}
