import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { ROUTE_PATHS } from '~/constants/routes.constants'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

interface LoginFormState {
  email: string
  password: string
  rememberSession: boolean
}

export const useLoginForm = () => {
  const authStore = useAuthStore()
  const { isSubmitting, loginError } = storeToRefs(authStore)
  const { addToast } = useToast()

  const formState = reactive<LoginFormState>({
    email: '',
    password: '',
    rememberSession: true,
  })

  const isSubmitDisabled = computed(() => !formState.email || !formState.password || isSubmitting.value)

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
    formState,
    isSubmitting,
    loginError,
    isSubmitDisabled,
    submitLoginForm,
  }
}
