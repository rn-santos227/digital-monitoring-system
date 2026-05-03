import type { SupabaseClient } from '@supabase/supabase-js'

export function getStoragePublicUrl(supabase: SupabaseClient, bucket: string, path: string): string {
  const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}
