import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

const KPI_COLUMN_FETCH_PAGE_SIZE = 1000

export interface SupabaseCountResult {
  count: number | null
  error: { message: string } | null
}

export const resolveCountResult = (
  result: SupabaseCountResult,
  label: string,
): number => {
  if (result.error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to count ${label}: ${result.error.message}`,
    })
  }

  return result.count ?? 0
}

export const countTableRows = async (
  supabase: SupabaseClient,
  tableName: string,
  label: string,
): Promise<number> => {
  const result = await supabase
    .from(tableName)
    .select('id', { count: 'exact', head: true })

  return resolveCountResult(result, label)
}

export const fetchStringColumnValues = async (
  supabase: SupabaseClient,
  tableName: string,
  columnName: string,
  label: string,
): Promise<string[]> => {
  const values: string[] = []
  let start = 0

  while (true) {
    const end = start + KPI_COLUMN_FETCH_PAGE_SIZE - 1
    const { data, error } = await supabase
      .from(tableName)
      .select(columnName)
      .range(start, end)
      .returns<Array<Record<string, string | null>>>()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to load ${label}: ${error.message}`,
      })
    }

    const rows = data ?? []
    rows.forEach((row) => {
      const value = row[columnName]
      if (typeof value === 'string' && value.trim().length > 0) {
        values.push(value)
      }
    })

    if (rows.length < KPI_COLUMN_FETCH_PAGE_SIZE) {
      break
    }

    start += KPI_COLUMN_FETCH_PAGE_SIZE
  }

  return values
}
