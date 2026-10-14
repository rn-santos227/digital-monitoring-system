import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSupabaseMock } from '@/tests/helpers/supabase'
import { createTestEvent } from '@/tests/helpers/h3-event'
import createSkill from '@/server/api/personnel/[id]/skills/index.post'
import updateSkill from '@/server/api/personnel/[id]/skills/[skillId].patch'
import removeSkill from '@/server/api/personnel/[id]/skills/[skillId].delete'

const mocks = vi.hoisted(() => ({ permission: vi.fn(), client: vi.fn(), audit: vi.fn(), body: vi.fn() }))
vi.mock('h3', async (importOriginal) => ({
  ...(await importOriginal<typeof import('h3')>()),
  readBody: mocks.body,
  getRouterParam: (_event: unknown, key: string) => key === 'skillId' ? 'skill-1' : 'person-1',
}))
vi.mock('@/server/utils/auth/requirePermission', () => ({ requirePermission: mocks.permission }))
vi.mock('@/server/utils/auth/serviceClient', () => ({ getServiceSupabaseClient: mocks.client }))
vi.mock('@/server/utils/audit/recordManagementAuditLog', () => ({ recordManagementAuditLog: mocks.audit }))

const body = { name: 'First aid', source: 'external', externalReference: 'CERT-123' }
const row = {
  id: 'skill-1', personnel_id: 'person-1', qualification_type: 'First aid',
  skill_source: 'external', external_reference: 'CERT-123', training_record_id: null,
  date_obtained: null, valid_until: null, training_record: null,
  created_at: 'created', updated_at: 'updated',
}

beforeEach(() => {
  vi.resetAllMocks()
  mocks.permission.mockResolvedValue({ id: 'actor' })
  mocks.body.mockResolvedValue(body)
  mocks.audit.mockResolvedValue(undefined)
})

describe('personnel skill mutation APIs', () => {
  it('returns a created list item, uses personnel.update, and audits success', async () => {
    const database = createSupabaseMock([
      { data: { id: 'person-1' }, error: null },
      { data: row, error: null },
    ])
    mocks.client.mockReturnValue(database.client)
    const event = createTestEvent('/api/personnel/person-1/skills', 'POST')
    expect(await createSkill(event)).toMatchObject({ ok: true, id: 'skill-1', item: { name: 'First aid', externalReference: 'CERT-123' } })
    expect(mocks.permission).toHaveBeenCalledWith(event, 'personnel.update')
    expect(mocks.audit).toHaveBeenCalledWith(event, expect.objectContaining({
      action: 'PERSONNEL_SKILL_CREATE', outcome: 'success', statusCode: 201,
      recordId: 'skill-1', tableName: 'personnel_qualifications',
    }))
    expect(database.calls.filter((call) => call.method === 'insert')).toHaveLength(1)
  })

  it('audits missing external references without accessing the database', async () => {
    mocks.body.mockResolvedValue({ ...body, externalReference: '' })
    await expect(createSkill(createTestEvent('/api/personnel/person-1/skills', 'POST'))).rejects.toMatchObject({ statusCode: 400 })
    expect(mocks.client).not.toHaveBeenCalled()
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ outcome: 'failed', statusCode: 400 }))
  })

  it('rejects training belonging to another person and audits the failed attempt', async () => {
    mocks.body.mockResolvedValue({ name: 'First aid', source: 'training', trainingRecordId: '22222222-2222-4222-8222-222222222222' })
    const database = createSupabaseMock([
      { data: { id: 'person-1' }, error: null }, { data: null, error: null },
    ])
    mocks.client.mockReturnValue(database.client)
    await expect(createSkill(createTestEvent('/api/personnel/person-1/skills', 'POST'))).rejects.toThrow('must belong')
    expect(database.calls.some((call) => call.method === 'insert')).toBe(false)
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ outcome: 'failed', statusCode: 400 }))
  })

  it('returns the edited item and logs both versions', async () => {
    mocks.body.mockResolvedValue({ ...body, name: 'Advanced first aid' })
    const database = createSupabaseMock([
      { data: row, error: null },
      { data: { ...row, qualification_type: 'Advanced first aid' }, error: null },
    ])
    mocks.client.mockReturnValue(database.client)
    expect(await updateSkill(createTestEvent('/api/personnel/person-1/skills/skill-1', 'PATCH'))).toMatchObject({ item: { name: 'Advanced first aid' } })
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      outcome: 'success', oldData: expect.objectContaining({ name: 'First aid' }),
      newData: expect.objectContaining({ name: 'Advanced first aid' }),
    }))
  })

  it('logs removal and preserves training records', async () => {
    const database = createSupabaseMock([
      { data: row, error: null }, { data: { id: 'skill-1' }, error: null },
    ])
    mocks.client.mockReturnValue(database.client)
    expect(await removeSkill(createTestEvent('/api/personnel/person-1/skills/skill-1', 'DELETE'))).toEqual({ ok: true })
    expect(database.calls.filter((call) => call.method === 'delete')).toEqual([
      { table: 'personnel_qualifications', method: 'delete', args: [] },
    ])
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ action: 'PERSONNEL_SKILL_DELETE', outcome: 'success' }))
  })

  it.each([
    { method: 'POST', handler: createSkill, results: [{ data: { id: 'person-1' }, error: null }] },
    { method: 'PATCH', handler: updateSkill, results: [{ data: row, error: null }] },
    { method: 'DELETE', handler: removeSkill, results: [{ data: row, error: null }] },
  ])('audits failed $method database writes', async ({ method, handler, results }) => {
    const database = createSupabaseMock([...results, { data: null, error: { message: 'Write rejected' } }])
    mocks.client.mockReturnValue(database.client)
    await expect(handler(createTestEvent('/api/personnel/person-1/skills/skill-1', method))).rejects.toThrow('Write rejected')
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ outcome: 'failed', statusCode: 500 }))
  })
})
