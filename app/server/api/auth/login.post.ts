import { createError, defineEventHandler, readBody, setCookie } from 'h3'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { generateSessionToken } from '../../utils/auth/sessionToken'

interface LoginBody {
  identifier?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const identifier = body.identifier?.trim()
  const password = body.password

  if (!identifier || !password) {
    throw createError({ statusCode: 400, statusMessage: 'identifier and password are required' })
  }

  const supabase = getServiceSupabaseClient()

  const { data: authRow, error: authError } = await supabase.rpc('authenticate_local_user', {
    p_identifier: identifier,
    p_password: password,
  })
})
