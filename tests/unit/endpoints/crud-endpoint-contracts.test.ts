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


  it('protects and audits the create endpoint', async () => {
    const source = readEndpoint(`${domain}/index.post.ts`)

    expectHandlerContract(source)
    expect(source).toContain('recordManagementAuditLog')
    expect(source).toContain('AUDIT_LOG_OUTCOMES.success')
    expect(source).toContain('AUDIT_LOG_OUTCOMES.failed')
  })

  it('protects the single-record read endpoint', async () => {
   const source = readEndpoint(`${domain}/[id]/index.get.ts`)

    expectHandlerContract(source)
    expect(source).toMatch(/getRouterParam\(event, ['"]id['"]\)/)
  })

  it('protects and audits every update endpoint', async () => {
    const updatePaths = domain === 'engagement-records'
      ? []
      : domain === 'incidents'
      ? [
          'deployment.patch.ts',
          'details.patch.ts',
          'equipment.patch.ts',
          'location.patch.ts',
          'personnel.patch.ts',
          'status.patch.ts',
        ].map((fileName) => `${domain}/[id]/${fileName}`)
      : domain === 'deployments'
        ? [
            `${domain}/[id]/details.patch.ts`,
            `${domain}/[id]/location.patch.ts`,
          ]
        : [`${domain}/[id]/index.patch.ts`]

  })
})
