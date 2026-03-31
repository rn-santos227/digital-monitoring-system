import type { H3Event } from 'h3'
import { createError } from 'h3'
import { getUser } from './getUser'

export async function requireAuth(event: H3Event) {
  const user = await getUser(event)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  }

  return user
}
