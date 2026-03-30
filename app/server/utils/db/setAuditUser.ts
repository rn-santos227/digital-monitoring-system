import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export async function setAuditUser(event: H3Event, userId: string | null) {
  const supabase = (await serverSupabaseClient(event)) as any

  const { error } = await supabase.rpc('set_audit_user', {
    audit_user_id: userId,
  })

  if (error) {
    throw new Error(`Failed to set audit user context: ${error.message}`)
  }
}
