import { useState } from "nuxt/app"

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export type Toast = {
  id: string
  title: string
  message?: string
  variant?: ToastVariant
  duration?: number
}

type ToastInput = Omit<Toast, 'id'>

const TOASTS_STATE_KEY = 'ui-toasts'

const useToastState = () => useState<Toast[]>(TOASTS_STATE_KEY, () => [])

const createToastId = () => `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`

export const useToast = () => {
  const toasts = useToastState()

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const addToast = (toast: ToastInput) => {
    const id = createToastId()
    const entry: Toast = {
      id,
      variant: 'info',
      duration: 4000,
      ...toast
    }

    toasts.value = [...toasts.value, entry]

    if (entry.duration && entry.duration > 0) {
      setTimeout(() => removeToast(id), entry.duration)
    }

    return id
  }

  return {
    toasts,
    addToast,
    removeToast
  }
}
