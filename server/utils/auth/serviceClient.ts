import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

function getSupabaseUrl(config: ReturnType<typeof useRuntimeConfig>) {
  return (
    process.env.NUXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    config.public?.supabaseUrl ||
    config.public?.supabase?.url
  )
}

function getSupabasePublicKey(config: ReturnType<typeof useRuntimeConfig>) {
  return (
    process.env.NUXT_PUBLIC_SUPABASE_KEY ||
    process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    config.public?.supabaseKey ||
    config.public?.supabase?.key
  )
}

export function getServiceSupabaseClient() {
  const config = useRuntimeConfig()
  const supabaseUrl = getSupabaseUrl(config)
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
