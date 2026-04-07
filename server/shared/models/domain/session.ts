import type { AuthenticatedUser } from './auth'

export interface SessionProfileRow extends AuthenticatedUser {
  is_active: boolean
}

export interface SessionUserRow {
  user_id: string
  user_profiles: SessionProfileRow
}
