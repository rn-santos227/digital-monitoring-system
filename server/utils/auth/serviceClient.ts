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
