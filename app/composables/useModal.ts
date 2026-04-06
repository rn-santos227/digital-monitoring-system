import { useState } from "nuxt/app"
import type { Component } from 'vue'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

export type ModalInput = {
  title?: string
  description?: string
  size?: ModalSize
  closeOnBackdrop?: boolean
  component: Component
  props?: Record<string, unknown>
}

export type ModalState = ModalInput & {
  id: string
}

const MODAL_STATE_KEY = 'ui-modals'

const useModalState = () => useState<ModalState[]>(MODAL_STATE_KEY, () => [])

const createModalId = () => `modal-${Date.now()}-${Math.random().toString(16).slice(2)}`

export const useModal = () => {
  const modals = useModalState()

  const openModal = (input: ModalInput) => {
    const id = createModalId()
    const entry: ModalState = {
      id,
      closeOnBackdrop: input.closeOnBackdrop ?? true,
      size: input.size ?? 'md',
      ...input
    }

    modals.value = [...modals.value, entry]

    return id
  }

  const closeModal = (id: string) => {
    modals.value = modals.value.filter((modal) => modal.id !== id)
  }

  const closeAllModals = () => {
    modals.value = []
  }

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals
  }
}
