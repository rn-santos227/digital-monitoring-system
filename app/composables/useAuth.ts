import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()

  const {
    currentUser,
    hasCheckedSession,
    isCheckingSession,
    isSubmitting,
    isLoggingOut,
    loginError,
    isAuthenticated
  } = storeToRefs(authStore)

  return {
    currentUser,
    hasCheckedSession,
    isCheckingSession,
    isSubmitting,
    isLoggingOut,
    loginError,
    isAuthenticated,
    initializeSession: authStore.initializeSession,
    login: authStore.login,
    logout: authStore.logout
  }
}

