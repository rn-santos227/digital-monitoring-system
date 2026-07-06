import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function updateUserEmailById(supabase: SupabaseClient, userId: string, email: string): Promise<void> {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    email,
    email_confirm: true,
  })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update user email: ${error.message}` })
  }
}
