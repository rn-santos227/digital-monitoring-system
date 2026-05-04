import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserProfileUpdate } from '../../shared/models'

export async function updateUserProfileFieldsById(supabase: SupabaseClient, userId: string, updates: UserProfileUpdate): Promise<void> {
  const { error } = await supabase.from('user_profiles').update(updates).eq('id', userId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update user profile: ${error.message}` })
  }
}
