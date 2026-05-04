import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function getUserProfileById<T>(supabase: SupabaseClient, id: string, selectColumns: string, errorContext: string): Promise<T> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(selectColumns)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `${errorContext}: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'User profile not found.' })
  }

  return data as T
}
