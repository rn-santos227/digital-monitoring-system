import { defineStore } from 'pinia'

type LoadingState = {
  activeRequests: number
  message: string
}

export const useLoadingStore = defineStore('loading', {
  state: (): LoadingState => ({
    activeRequests: 0,
    message: 'Processing request...'
  }),

  getters: {
    isLoading: (state) => state.activeRequests > 0
  },
})
