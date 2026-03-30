export type UUID = string
export type ISODateTime = string

export interface UserProfile {
  id: UUID
  personnel_id: UUID | null
  username: string
  full_name: string
  avatar_url: string | null
  is_active: boolean
  last_login_at: ISODateTime | null
  created_at: ISODateTime
  updated_at: ISODateTime
}

export interface AuthSession {
  id: UUID
  user_id: UUID
  access_token: string
  refresh_token: string | null
  provider: string
  ip_address: string | null
  user_agent: string | null
  expires_at: ISODateTime
  revoked_at: ISODateTime | null
  created_at: ISODateTime
}

export interface AccountType {
  id: UUID
  code: string
  name: string
  description: string | null
  is_system: boolean
  created_at: ISODateTime
  updated_at: ISODateTime
}

export interface Permission {
  id: UUID
  code: string
  name: string
  module: string
  created_at: ISODateTime
}

export interface UserAccountType {
  id: UUID
  user_id: UUID
  account_type_id: UUID
  assigned_at: ISODateTime
  assigned_by: UUID | null
}
