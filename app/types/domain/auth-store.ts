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
  email: string
  password: string
}

export interface AuthState {
  currentUser: SessionUser | null
  hasCheckedSession: boolean
  isCheckingSession: boolean
  isSubmitting: boolean
  isLoggingOut: boolean
  loginError: string
}
