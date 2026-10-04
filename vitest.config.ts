import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    {
      name: 'unit-test-nuxt-runtime-flags',
      transform(source, id) {
        if (!id.includes('/app/')) {
          return
        }

        return source
          .replaceAll('import.meta.client', 'Boolean(globalThis.__TEST_NUXT_CLIENT__)')
          .replaceAll('import.meta.server', '!globalThis.__TEST_NUXT_CLIENT__')
      },
    },
  ],
  resolve: {
    alias: {
      '~/constants': fileURLToPath(new URL('./app/constants', import.meta.url)),
      '~/types': fileURLToPath(new URL('./app/types', import.meta.url)),
      '~/utils': fileURLToPath(new URL('./app/utils', import.meta.url)),
      '~/stores': fileURLToPath(new URL('./app/stores', import.meta.url)),
      '~/handlers': fileURLToPath(new URL('./app/handlers', import.meta.url)),
      '~/composables': fileURLToPath(new URL('./app/composables', import.meta.url)),
      '~': fileURLToPath(new URL('.', import.meta.url)),
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    passWithNoTests: false,
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: [
        'app/utils/**/*.ts',
        'app/stores/**/*.ts',
        'app/handlers/**/*.ts',
        'app/composables/**/*.ts',
        'server/api/**/*.ts',
        'server/shared/utils/**/*.ts',
        'server/shared/validation/**/*.ts',
        'server/utils/**/*.ts',
        'server/middleware/**/*.ts',
      ],
      exclude: ['**/index.ts'],
    },
  },
})
