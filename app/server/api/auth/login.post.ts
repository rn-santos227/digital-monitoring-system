import { createError, defineEventHandler, readBody, setCookie } from 'h3'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { generateSessionToken } from '../../utils/auth/sessionToken'

interface LoginBody {
  identifier?: string
  password?: string
}

export default defineEventHandler(async (event) => {

})
