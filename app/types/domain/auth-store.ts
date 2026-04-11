export interface SessionUser {
  id: string
  email: string
  fullName: string | null
}

export interface SessionResponse {
  ok: boolean
  user: SessionUser
  sessionToken?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthState {
  currentUser: SessionUser | null
  hasCheckedSession: boolean
  isCheckingSession: boolean
  sessionInitializationPromise: Promise<void> | null
  isSubmitting: boolean
  isLoggingOut: boolean
  loginError: string
}
