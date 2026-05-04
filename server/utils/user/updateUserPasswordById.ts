import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function updateUserPasswordById(supabase: SupabaseClient, id: string, newPassword: string): Promise<void> {
  const { error } = await supabase.rpc('set_user_profile_password', {
    p_user_id: id,
    p_password: newPassword,
  })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update password: ${error.message}` })
  }
}
