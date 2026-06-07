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

type UserAccountTypeRow = {
  id: string
  user_id: string
  account_type_id: string
  assigned_at: string
  assigned_by: string | null
}

export interface AuthDatabase {
  public: {
    Tables: {
      auth_sessions: {
        Row: AuthSessionRow
        Insert: AuthSessionInsert
        Update: Partial<AuthSessionInsert> & { revoked_at?: string | null }
        Relationships: [
          {
            foreignKeyName: 'auth_sessions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
        ]
      }
      user_profiles: {
        Row: UserProfileRow
        Insert: Partial<UserProfileRow> & Pick<UserProfileRow, 'id' | 'email' | 'full_name'>
        Update: Partial<UserProfileRow>
        Relationships: []
      }
      account_types: {
        Row: AccountTypeRow
        Insert: Partial<AccountTypeRow> & Pick<AccountTypeRow, 'code' | 'name'>
        Update: Partial<AccountTypeRow>
        Relationships: []
      }
    }
  }
}

