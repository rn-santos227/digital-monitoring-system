import { randomBytes } from 'node:crypto'

export function generateSessionToken() {
  return randomBytes(48).toString('base64url')
}
