import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { validateEmailField, validateField } from '~/utils/field-validation'

export interface LoginFormState {
  email: string
  password: string
  rememberSession: boolean
}

interface LoginFormErrors {
  email: string
  password: string
}

export const useLoginForm = () => {
  const authStore = useAuthStore()
  const { isSubmitting, loginError } = storeToRefs(authStore)

  const formState = reactive<LoginFormState>({
    email: '',
    password: '',
    rememberSession: true,
  })

  const formErrors = reactive<LoginFormErrors>({
    email: '',
    password: '',
  })

  const validateForm = () => {
    const emailValidation = validateEmailField('email', 'Email', formState.email)
    const passwordValidation = validateField({
      field: 'password',
      label: 'Password',
      value: formState.password,
      required: true,
      minLength: 8,
      maxLength: 128,
    })

    formState.email = emailValidation.value
    formState.password = passwordValidation.value

    formErrors.email = emailValidation.error
    formErrors.password = passwordValidation.error

    return emailValidation.isValid && passwordValidation.isValid
  }

  const isSubmitDisabled = computed(() => {
    const hasValue = Boolean(formState.email.trim()) && Boolean(formState.password.trim())
    const hasValidationErrors = Boolean(formErrors.email || formErrors.password)

    return !hasValue || hasValidationErrors || isSubmitting.value
  })

  return {
    formState,
    formErrors,
    isSubmitting,
    loginError,
    isSubmitDisabled,
    validateForm,
  }
}
