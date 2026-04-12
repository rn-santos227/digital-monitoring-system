import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

export interface LoginFormState {
  email: string
  password: string
  rememberSession: boolean
}

export const useLoginForm = () => {
  const authStore = useAuthStore()
  const { isSubmitting, loginError } = storeToRefs(authStore)

  const formState = reactive<LoginFormState>({
    email: '',
    password: '',
    rememberSession: true,
  })

  const isSubmitDisabled = computed(() => !formState.email || !formState.password || isSubmitting.value)

  return {
    formState,
    isSubmitting,
    loginError,
    isSubmitDisabled,
  }
}
