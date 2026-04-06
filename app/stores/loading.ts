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

  actions: {
    start(message?: string) {
      this.activeRequests += 1
      if (message) {
        this.message = message
      }
    },

    stop() {
      if (this.activeRequests === 0) {
        return
      }

      this.activeRequests -= 1

      if (this.activeRequests === 0) {
        this.message = 'Processing request...'
      }
    }
  }
})
