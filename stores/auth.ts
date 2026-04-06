import { defineStore } from 'pinia'
import { AUTH_API_ENDPOINTS } from '../constants/api.constants'
import { ref } from 'vue'

interface SessionUser {
  id: string
  username: string
  fullName: string | null
}

interface SessionResponse {
  ok: boolean
  user: SessionUser
}

interface LoginPayload {
  identifier: string
  password: string
}

const DEFAULT_LOGIN_ERROR = 'Unable to sign in. Please try again.'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<SessionUser | null>(null)
  const hasCheckedSession = ref(false)
  const isCheckingSession = ref(false)
  const isSubmitting = ref(false)
  const isLoggingOut = ref(false)
  const loginError = ref('')


})
