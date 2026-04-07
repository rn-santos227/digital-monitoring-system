export interface SessionUser {
  id: string
  username: string
  fullName: string | null
}

export interface SessionResponse {
  ok: boolean
  user: SessionUser
}

export interface LoginPayload {
  identifier: string
  password: string
}

