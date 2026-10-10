import { ref, type Ref } from 'vue'

const states = new Map<string, Ref<unknown>>()

/** Models Nuxt's per-request keyed state without requiring a running app. */
export const useState = <T>(key: string, initialize: () => T): Ref<T> => {
  let state = states.get(key)
  if (!state) {
    state = ref(initialize()) as Ref<T>
    states.set(key, state)
  }
  return state as Ref<T>
}

export const clearNuxtState = () => states.clear()
