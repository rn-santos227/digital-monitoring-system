import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

export function getServiceSupabaseClient() {
  const config = useRuntimeConfig()
  const supabaseUrl =
    process.env.NUXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    config.public?.supabaseUrl ||
    config.public?.supabase?.url
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_KEY ||
    config.supabaseServiceRoleKey

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase server auth is not configured. Missing URL or service role key.')
  }

  return createClient(supabaseUrl as string, serviceRoleKey as string)
}
