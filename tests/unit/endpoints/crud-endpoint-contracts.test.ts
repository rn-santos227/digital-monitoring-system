/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest'

const endpointSources = import.meta.glob('/server/api/**/*.ts', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const CRUD_DOMAINS = [
  'account-types',
  'battalions',
  'companies',
  'deployment-records',
  'deployments',
  'engagement-records',
  'engagements',
  'equipment-assets',
  'equipment-categories',
  'equipment-issuances',
  'equipment-items',
  'incidents',
  'personnel',
  'training-categories',
  'training-records',
  'trainings',
]

const readEndpoint = (relativePath: string): string => {
  const source = endpointSources[`/server/api/${relativePath}`]

  if (!source) {
    throw new Error(`Endpoint source was not found: ${relativePath}`)
  }

  return source
}

const expectHandlerContract = (source: string) => {
  expect(source).toContain('export default defineEventHandler')
  expect(source).toMatch(/require(?:Any)?Permission\(|requireBulkPermission\(/)
}

describe.each(CRUD_DOMAINS)('%s CRUD endpoint contracts', (domain) => {
  it('protects the collection read endpoint', async () => {
    const source = readEndpoint(`${domain}/index.get.ts`)

    expectHandlerContract(source)
  })

})
