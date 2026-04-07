import { createPinia, setActivePinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()

  nuxtApp.vueApp.use(pinia)
  setActivePinia(pinia)

  if (import.meta.client && nuxtApp.payload.pinia) {
    pinia.state.value = nuxtApp.payload.pinia as typeof pinia.state.value
  }

  if (import.meta.server) {
    nuxtApp.hooks.hook('app:rendered', () => {
      nuxtApp.payload.pinia = pinia.state.value
      setActivePinia(undefined)
    })
  }
})
