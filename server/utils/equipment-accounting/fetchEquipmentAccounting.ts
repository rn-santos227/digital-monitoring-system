import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  EQUIPMENT_ACCOUNTING_SUBJECT_CONFIG,
  EQUIPMENT_ASSIGNMENT_VALUE_SELECT_COLUMNS,
  EQUIPMENT_ASSIGNMENT_VALUE_SUMMARY_SELECT_COLUMNS,
  ID_ONLY_SELECT_COLUMNS,
} from '../../shared/constants'
import type {
  EquipmentAccountingSubject,
  EquipmentAssignmentValueRow,
  EquipmentAssignmentValueSummaryRow,
} from '../../shared/models'
import { mapEquipmentAssignmentValue, mapEquipmentAssignmentValueSummary } from '../../shared/utils'

export async function fetchEquipmentAccounting(
  supabase: SupabaseClient,
  subject: EquipmentAccountingSubject,
  subjectId: string,
  rangeFrom: number,
  rangeTo: number,
) {
  const config = EQUIPMENT_ACCOUNTING_SUBJECT_CONFIG[subject]
  const { data: owner, error: ownerError } = await supabase.from(config.table)
    .select(ID_ONLY_SELECT_COLUMNS).eq('id', subjectId).maybeSingle()

  if (ownerError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load equipment valuation subject: ${ownerError.message}` })
  }
  if (!owner) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment valuation subject not found.' })
  }

  const [summaryResult, itemsResult] = await Promise.all([
    supabase.from('vw_equipment_assignment_value_totals')
      .select(EQUIPMENT_ASSIGNMENT_VALUE_SUMMARY_SELECT_COLUMNS)
      .eq('subject_type', subject).eq('subject_id', subjectId).maybeSingle(),
    supabase.from('vw_equipment_assignment_values')
      .select(EQUIPMENT_ASSIGNMENT_VALUE_SELECT_COLUMNS, { count: 'exact' })
      .eq(config.column, subjectId)
      .order('asset_tag', { ascending: true }).order('equipment_asset_id', { ascending: true })
      .range(rangeFrom, rangeTo),
  ])

  const error = summaryResult.error ?? itemsResult.error
  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch assigned equipment values: ${error.message}` })
  }

  return {
    summary: mapEquipmentAssignmentValueSummary(summaryResult.data as EquipmentAssignmentValueSummaryRow | null),
    items: ((itemsResult.data ?? []) as EquipmentAssignmentValueRow[]).map(mapEquipmentAssignmentValue),
    totalItems: itemsResult.count ?? 0,
  }
}
