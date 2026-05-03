import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { PersonnelBatchUploadRowRequest } from '../../shared/requests'
import { PERSONNEL_REFERENCE_ID_SELECT_COLUMNS } from '../../shared/constants'
import { parseCreatePersonnelPayload } from '../../shared/validations'
import {
  assertCompanyBelongsToBattalion,
  resolvePersonnelBattalionId,
  resolvePersonnelCompanyAssignment,
  resolvePersonnelEmploymentStatusId,
  resolvePersonnelServiceStatusId,
} from '../../shared/utils'

export const processPersonnelBatchUpload = async (
  supabase: SupabaseClient,
  parsedRows: PersonnelBatchUploadRowRequest[],
): Promise<number> => {
  let insertedCount = 0

  for (const row of parsedRows) {
    const payload = parseCreatePersonnelPayload({
      ...row,
      dateEnlisted: row.dateEnlisted ?? new Date().toISOString().slice(0, 10),
    })

    const { data: rank, error: rankError } = await supabase
      .from('ranks')
      .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
      .eq('id', payload.rank_id)
      .maybeSingle()

    if (rankError || !rank) {
      const { data: rankByCode, error: rankByCodeError } = await supabase
        .from('ranks')
        .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
        .eq('code', payload.rank_id)
        .maybeSingle()

      if (rankByCodeError || !rankByCode) {
        throw createError({ statusCode: 400, statusMessage: `Invalid rank value for service number ${payload.service_number}.` })
      }

      payload.rank_id = rankByCode.id
    }

    payload.employment_status_id = await resolvePersonnelEmploymentStatusId(supabase, payload.employment_status_id)
    payload.service_status_id = await resolvePersonnelServiceStatusId(supabase, payload.service_status_id)

    if (payload.battalion_id) {
      payload.battalion_id = await resolvePersonnelBattalionId(supabase, payload.battalion_id, payload.service_number)
    }

    if (payload.company_id) {
      const assignment = await resolvePersonnelCompanyAssignment(
        supabase,
        payload.company_id,
        payload.battalion_id ?? null,
        payload.service_number,
      )
      payload.company_id = assignment.companyId
      payload.battalion_id = assignment.battalionId
    }

    if (payload.company_id && payload.battalion_id) {
      await assertCompanyBelongsToBattalion({
        supabase,
        companyId: payload.company_id,
        battalionId: payload.battalion_id,
      })
    }

    const { error: insertError } = await supabase
      .from('personnel')
      .insert(payload)

    if (insertError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to create personnel record for ${payload.service_number}: ${insertError.message}` })
    }

    insertedCount += 1
  }

  return insertedCount
}
