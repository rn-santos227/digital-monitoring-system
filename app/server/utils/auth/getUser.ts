import type { H3Event } from 'h3'
import { getCookie, getHeader } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { getServiceSupabaseClient } from './serviceClient'

export async function getUser(event: H3Event) {
  const bearer = getHeader(event, 'authorization')
  const tokenFromHeader = bearer?.startsWith('Bearer ') ? bearer.slice(7).trim() : null
  const token = tokenFromHeader || getCookie(event, 'dms_session')

  if (token) {
    const supabase = getServiceSupabaseClient()
    const now = new Date().toISOString()

  }
}
