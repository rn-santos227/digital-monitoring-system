import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'

const nuxtAppManifestAlias = fileURLToPath(new URL('./app/utils/nuxt-app-manifest.ts', import.meta.url))

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey =
  process.env.NUXT_PUBLIC_SUPABASE_KEY ||
  process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@pinia/nuxt', '@nuxtjs/supabase', 'nuxt-echarts'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  css: ['./app/assets/css/main.css'],
  alias: {
    '#app-manifest': nuxtAppManifestAlias,
  },
  vite: {
    resolve: {
      alias: {
        '#app-manifest': nuxtAppManifestAlias,
      },
    },
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@heroicons/vue/24/outline',
        'exceljs',
      ],
    },
  },
  runtimeConfig: {
    supabaseServiceRoleKey,
    public: {
      supabase: {
        redirect: false,
      },
      supabaseUrl: supabaseUrl,
      supabaseKey: supabaseKey,
    },
  },
  typescript: {
    strict: true,
  },
  devtools: { enabled: true },
})