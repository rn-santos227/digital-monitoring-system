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


})
