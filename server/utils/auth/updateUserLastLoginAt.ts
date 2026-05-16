import type { SupabaseClient } from '@supabase/supabase-js'

export async function updateUserLastLoginAt(supabase: SupabaseClient, userId: string): Promise<void> {
  const { error } = await supabase
    .from('user_profiles')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) {
    throw new Error(`Failed to update last login: ${error.message}`)
  }
}
