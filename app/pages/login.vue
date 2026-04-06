<template>
  <div class="grid min-h-screen bg-slate-100 lg:grid-cols-2">
    <section class="relative overflow-hidden bg-emerald-800 px-10 py-14 text-white sm:px-14 lg:px-16">
      
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { ROUTE_PATHS } from '~/constants/routes.constants'

const router = useRouter()
const currentYear = new Date().getFullYear()
const rememberMe = ref(false)

const credentials = reactive({
  identifier: '',
  password: ''
})

const { isSubmitting, loginError, login } = useAuth()

const onLogin = async () => {
  const success = await login({
    identifier: credentials.identifier,
    password: credentials.password
  })

  if (!success) return

  credentials.password = ''
  await router.push(ROUTE_PATHS.home)
}
</script>
