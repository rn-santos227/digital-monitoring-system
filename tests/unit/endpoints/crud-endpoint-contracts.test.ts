/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'

const endpointSources = import.meta.glob('/server/api/**/*.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>
