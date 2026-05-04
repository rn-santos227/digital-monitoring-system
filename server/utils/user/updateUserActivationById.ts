import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function updateUserActivationById(supabase: SupabaseClient, id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('user_profiles')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update user activation state: ${error.message}` })
  }
}
