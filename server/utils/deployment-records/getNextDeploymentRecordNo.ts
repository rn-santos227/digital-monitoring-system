import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

const DEPLOYMENT_RECORD_NO_PREFIX = 'DR-'
const DEPLOYMENT_RECORD_NO_PADDING = 6

const parseRecordSequence = (recordNo: string | null): number => {
  if (!recordNo || !recordNo.startsWith(DEPLOYMENT_RECORD_NO_PREFIX)) {
    return 0
  }

  const rawValue = recordNo.slice(DEPLOYMENT_RECORD_NO_PREFIX.length)
  const numericValue = Number.parseInt(rawValue, 10)

  if (Number.isNaN(numericValue) || numericValue < 0) {
    return 0
  }

  return numericValue
}

export async function getNextDeploymentRecordNo(supabase: SupabaseClient): Promise<string> {
  const { data, error } = await supabase
    .from('deployment_records')
    .select('record_no')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<{ record_no: string | null }>()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to resolve next deployment record number: ${error.message}` })
  }

  const currentNumber = parseRecordSequence(data?.record_no ?? null)
  const nextNumber = currentNumber + 1

  return `${DEPLOYMENT_RECORD_NO_PREFIX}${String(nextNumber).padStart(DEPLOYMENT_RECORD_NO_PADDING, '0')}`
}
