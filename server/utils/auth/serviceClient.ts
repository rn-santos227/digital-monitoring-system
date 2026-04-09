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
