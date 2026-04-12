import type { Ref } from 'vue'
import { ROUTE_PATHS } from '~/constants/routes.constants'
import type { LoginFormState } from '~/composables/useLogin'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

export const useLoginPageHandlers = (formState: LoginFormState, loginError: Ref<string | null>) => {
  const authStore = useAuthStore()
  const { addToast } = useToast()

  const submitLoginForm = async () => {
    try {
      await authStore.login({
        email: formState.email,
        password: formState.password,
      })

      addToast({
        title: 'Welcome back',
        message: 'Authenticated personnel session is now active.',
        variant: 'success',
      })

      await navigateTo(ROUTE_PATHS.home, { replace: true })
    } catch {
      addToast({
        title: 'Sign-in failed',
        message: loginError.value || 'Verify your credentials and try again.',
        variant: 'error',
      })
    }
  }

  return {
    submitLoginForm,
  }
}
