import { createError, defineEventHandler, deleteCookie, getCookie, getHeader } from 'h3'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event) => {
  const bearer = getHeader(event, 'authorization')
  const tokenFromHeader = bearer?.startsWith('Bearer ') ? bearer.slice(7).trim() : null
  const token = tokenFromHeader || getCookie(event, 'dms_session')


})
