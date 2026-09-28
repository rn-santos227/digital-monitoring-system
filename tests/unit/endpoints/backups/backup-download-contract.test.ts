/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'

const endpointSources = import.meta.glob('/server/api/backups/*.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

describe('backup download endpoint contract', () => {
  it('requires the backup permission and audits successful and failed downloads', () => {

  }
}
