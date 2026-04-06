<template>
  <div class="grid min-h-screen bg-slate-100 lg:grid-cols-2">
    <section class="relative overflow-hidden bg-emerald-800 px-10 py-14 text-white sm:px-14 lg:px-16">
      <div class="mx-auto flex h-full max-w-xl flex-col justify-between">
        <div>
          <p class="text-2xl font-semibold tracking-wide">Digital Monitoring System</p>
          <p class="mt-1 text-lg text-emerald-200">Operations Portal</p>
        </div>

        <div class="py-12">
          <h1 class="max-w-md text-4xl font-semibold leading-tight sm:text-5xl">
            Welcome to Your Monitoring and Response Platform
          </h1>
          <p class="mt-8 max-w-lg text-lg leading-8 text-emerald-200">
            Track incidents, readiness, and operational activities in one secure, centralized system.
          </p>
        </div>

        <p class="text-sm text-emerald-200">© {{ currentYear }} Digital Monitoring System. All rights reserved.</p>
      </div>
    </section>

    <section class="flex items-center justify-center px-6 py-16 sm:px-10">
      <BaseCard
        title="Sign In"
        subtitle="Enter your credentials to access your account"
        class="w-full max-w-lg"
        padding="lg"
      >
        <form class="space-y-6" @submit.prevent="onLogin">
          <BaseTextField
            v-model="credentials.identifier"
            label="Username"
            placeholder="Enter your username"
            :disabled="isSubmitting"
            required
          /> 

          <BaseTextField
            v-model="credentials.password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            :disabled="isSubmitting"
            required
          />
        </form>
      </BaseCard>
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
