import { defineStore } from 'pinia'

type LoadingState = {
  activeRequests: number
  message: string
}

const loadingStoreOption = {
  state: (): LoadingState => ({
    activeRequests: 0,
    message: 'Processing request...'
  }),

  getters: {
    isLoading: (state: LoadingState) => state.activeRequests > 0
  },

  actions: {
    start(this: LoadingState, message?: string) {
      this.activeRequests += 1
      if (message) {
        this.message = message
      }
    },

    stop(this: LoadingState,) {
      if (this.activeRequests === 0) {
        return
      }

      this.activeRequests -= 1

      if (this.activeRequests === 0) {
        this.message = 'Processing request...'
      }
    }
  }
}

export const useLoadingStore = defineStore('loading', loadingStoreOption)
