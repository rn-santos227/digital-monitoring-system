export interface LoginBody {
  email?: string
  password?: string
}

export interface AuthenticatedUser {
  id: string
  email: string
  full_name: string | null
  account_type_codes: string[]
  permission_codes: string[]
}

export interface StoreSessionInput {
  userId: string
  accessToken: string
  refreshToken?: string | null
  provider: string
  expiresAt: string
}

export interface RevokeSessionInput {
  sessionId?: string
  accessToken?: string
}

type AuthSessionRow = {
  id: string
  user_id: string
  access_token: string
  refresh_token: string | null
  provider: string
  ip_address: string | null
  user_agent: string | null
  expires_at: string
  revoked_at: string | null
  created_at: string
}

type AuthSessionInsert = {
  id?: string
  user_id: string
  access_token: string
  refresh_token?: string | null
  provider: string
  ip_address?: string | null
  user_agent?: string | null
  expires_at: string
  revoked_at?: string | null
  created_at?: string
}

type UserProfileRow = {
  id: string
  personnel_id: string | null
  email: string
  full_name: string
  avatar_url: string | null
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

type AccountTypeRow = {
  id: string
  code: string
  name: string
  description: string | null
  is_system: boolean
  created_at: string
  updated_at: string
}
