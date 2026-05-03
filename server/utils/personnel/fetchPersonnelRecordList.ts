import type { SupabaseClient } from '@supabase/supabase-js'

interface FetchPersonnelRecordListOptions {
  table: 'deployment_records' | 'engagement_records' | 'equipment_issuances' | 'training_records'
  selectColumns: string
  matchField: string
  matchValue: string
  orderFields: Array<{ column: string, ascending: boolean }>
  rangeFrom: number
  rangeTo: number
}

export const fetchPersonnelRecordList = async (supabase: SupabaseClient, options: FetchPersonnelRecordListOptions) => {
  let query = supabase
    .from(options.table)
    .select(options.selectColumns, { count: 'exact' })
    .eq(options.matchField, options.matchValue)

  for (const orderField of options.orderFields) {
    query = query.order(orderField.column, { ascending: orderField.ascending })
  }

  return query.range(options.rangeFrom, options.rangeTo)
}
