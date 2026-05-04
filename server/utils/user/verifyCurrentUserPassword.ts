import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

interface VerifyCurrentUserPasswordParams {
  supabase: SupabaseClient
  email: string
  currentPassword: string
  userId: string
}

interface AuthenticatedUserRow {
  user_id: string
}

export async function verifyCurrentUserPassword(params: VerifyCurrentUserPasswordParams): Promise<void> {
  const { supabase, email, currentPassword, userId } = params
  const { data, error } = await supabase.rpc('authenticate_local_user', {
    p_email: email,
    p_password: currentPassword,
  })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to verify current password: ${error.message}` })
  }

  const authenticatedUser = (data?.[0] ?? null) as AuthenticatedUserRow | null
  if (!authenticatedUser || authenticatedUser.user_id !== userId) {
    throw createError({ statusCode: 401, statusMessage: 'Current password is invalid.' })
  }
}
