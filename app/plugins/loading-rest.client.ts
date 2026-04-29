import { useLoadingStore } from '~/stores/loading'

export default defineNuxtPlugin(() => {
  const loadingStore = useLoadingStore()
  loadingStore.reset()
})
