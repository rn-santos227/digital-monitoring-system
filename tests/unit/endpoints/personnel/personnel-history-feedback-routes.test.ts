import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSupabaseMock } from '@/tests/helpers/supabase'
import { createTestEvent } from '@/tests/helpers/h3-event'
import employmentCreate from '@/server/api/personnel/[id]/employment-records/index.post'
import educationCreate from '@/server/api/personnel/[id]/education-records/index.post'
import employmentUpdate from '@/server/api/personnel/[id]/employment-records/[recordId].patch'
import educationDelete from '@/server/api/personnel/[id]/education-records/[recordId].delete'
import feedbackCreate from '@/server/api/personnel/[id]/performance-feedback/index.post'

const mocks = vi.hoisted(() => ({ permission: vi.fn(), client: vi.fn(), audit: vi.fn(), body: vi.fn() }))
vi.mock('h3', async (importOriginal) => ({
  ...(await importOriginal<typeof import('h3')>()),
  readBody: mocks.body,
  getRouterParam: (_event: unknown, key: string) => key === 'recordId' ? 'record-1' : 'person-1',
}))
vi.mock('@/server/utils/auth/requirePermission', () => ({ requirePermission: mocks.permission }))
vi.mock('@/server/utils/auth/serviceClient', () => ({ getServiceSupabaseClient: mocks.client }))
vi.mock('@/server/utils/audit/recordManagementAuditLog', () => ({ recordManagementAuditLog: mocks.audit }))

const official = {
  id: 'official-user', full_name: 'Official display name', is_active: true,
  personnel: {
    id: 'official-personnel', first_name: 'Juan', middle_name: null, last_name: 'Dela Cruz',
    service_number: 'SN-123', position: 'Company Commander', rank: { code: 'CPT', name: 'Captain' },
  },
}
const feedbackBody = { feedback: 'Reliable team leadership.', reviewDate: '2026-10-12', rating: 5, attestAuthorship: true }
const feedbackRow = {
  id: 'feedback-1', personnel_id: 'person-1', feedback: feedbackBody.feedback, review_date: feedbackBody.reviewDate, rating: 5,
  author_user_id: 'official-user', author_personnel_id: 'official-personnel', author_name: 'Juan Dela Cruz',
  author_title: 'Company Commander', author_rank: 'Captain', author_service_number: 'SN-123', officiated_at: '2026-10-12T01:00:00Z',
}
const employmentRow = {
  id: 'record-1', personnel_id: 'person-1', employer_name: 'Company', job_title: 'Technician',
  start_date: null, end_date: null, reference: null, remarks: null, created_at: 'created', updated_at: 'updated',
}

beforeEach(() => {
  vi.resetAllMocks()
  mocks.permission.mockResolvedValue({ id: 'official-user' })
  mocks.audit.mockResolvedValue(undefined)
})

describe('personnel history mutations', () => {
  it.each([
    { kind: 'employment', table: 'personnel_employment_records', handler: employmentCreate, row: employmentRow },
    { kind: 'education', table: 'personnel_education_records', handler: educationCreate, row: { ...employmentRow, institution_name: 'Company', qualification_name: 'Technician', education_level: null } },
  ])('creates $kind records and returns a list-ready item with an audit', async ({ kind, table, handler, row }) => {
    mocks.body.mockResolvedValue({ organization: 'Company', description: 'Technician' })
    const database = createSupabaseMock([{ data: { id: 'person-1' }, error: null }, { data: row, error: null }])
    mocks.client.mockReturnValue(database.client)
    const event = createTestEvent(`/api/personnel/person-1/${kind}-records`, 'POST')
    expect(await handler(event)).toMatchObject({ ok: true, id: 'record-1', item: { organization: 'Company', description: 'Technician' } })
    expect(mocks.permission).toHaveBeenCalledWith(event, 'personnel.update')
    expect(database.calls.filter((call) => call.method === 'insert')).toHaveLength(1)
    expect(mocks.audit).toHaveBeenCalledWith(event, expect.objectContaining({ tableName: table, outcome: 'success', statusCode: 201 }))
  })

  it('audits invalid dates without obtaining a mutation client', async () => {
    mocks.body.mockResolvedValue({ organization: 'College', description: 'Diploma', startDate: '2026-02-30' })
    await expect(educationCreate(createTestEvent('/api/personnel/person-1/education-records', 'POST'))).rejects.toMatchObject({ statusCode: 400 })
    expect(mocks.client).not.toHaveBeenCalled()
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ outcome: 'failed', statusCode: 400 }))
  })

  it('updates only the history record within the requested personnel scope', async () => {
    mocks.body.mockResolvedValue({ organization: 'Company', description: 'Senior technician' })
    const database = createSupabaseMock([
      { data: { id: 'person-1' }, error: null }, { data: employmentRow, error: null },
      { data: { ...employmentRow, job_title: 'Senior technician' }, error: null },
    ])
    mocks.client.mockReturnValue(database.client)
    expect(await employmentUpdate(createTestEvent('/api/personnel/person-1/employment-records/record-1', 'PATCH'))).toMatchObject({ item: { description: 'Senior technician' } })
    expect(database.calls).toContainEqual({ table: 'personnel_employment_records', method: 'eq', args: ['personnel_id', 'person-1'] })
    expect(database.calls).toContainEqual({ table: 'personnel_employment_records', method: 'eq', args: ['id', 'record-1'] })
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      oldData: expect.objectContaining({ description: 'Technician' }), newData: expect.objectContaining({ description: 'Senior technician' }),
    }))
  })

  it('rejects deletion when a history record does not belong to the personnel', async () => {
    const database = createSupabaseMock([{ data: { id: 'person-1' }, error: null }, { data: null, error: null }])
    mocks.client.mockReturnValue(database.client)
    await expect(educationDelete(createTestEvent('/api/personnel/person-1/education-records/record-1', 'DELETE'))).rejects.toMatchObject({ statusCode: 404 })
    expect(database.calls.some((call) => call.method === 'delete')).toBe(false)
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ outcome: 'failed', statusCode: 404 }))
  })
})

describe('official attribution for performance feedback', () => {
  it('binds author identity to the authenticated official and ignores forged credentials', async () => {
    mocks.body.mockResolvedValue({
      ...feedbackBody, authorUserId: 'other-official', authorRank: 'General', authorServiceNumber: 'FORGED',
      officiatedAt: '2000-01-01', authorName: 'Someone else',
    })
    const database = createSupabaseMock([
      { data: { id: 'person-1' }, error: null }, { data: official, error: null }, { data: feedbackRow, error: null },
    ])
    mocks.client.mockReturnValue(database.client)
    const event = createTestEvent('/api/personnel/person-1/performance-feedback', 'POST')
    expect(await feedbackCreate(event)).toMatchObject({
      ok: true, item: { authorUserId: 'official-user', authorRank: 'Captain', authorServiceNumber: 'SN-123' },
    })
    expect(mocks.permission).toHaveBeenCalledWith(event, 'personnel.feedback')
    expect(database.calls).toContainEqual({ table: 'user_profiles', method: 'eq', args: ['id', 'official-user'] })
    const inserted = database.calls.find((call) => call.method === 'insert')?.args[0]
    expect(inserted).toEqual({
      personnel_id: 'person-1', feedback: feedbackBody.feedback, review_date: feedbackBody.reviewDate,
      rating: 5, author_user_id: 'official-user', authorship_confirmed: true,
    })
    expect(mocks.audit).toHaveBeenCalledWith(event, expect.objectContaining({ outcome: 'success', statusCode: 201, action: 'PERSONNEL_FEEDBACK_OFFICIATE' }))
  })

  it('rejects unconfirmed authorship before opening a database client', async () => {
    mocks.body.mockResolvedValue({ ...feedbackBody, attestAuthorship: false })
    await expect(feedbackCreate(createTestEvent('/api/personnel/person-1/performance-feedback', 'POST'))).rejects.toMatchObject({ statusCode: 400 })
    expect(mocks.client).not.toHaveBeenCalled()
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ outcome: 'failed', statusCode: 400 }))
  })

  it.each([
    { ...official, is_active: false },
    { ...official, personnel: null },
    { ...official, personnel: { ...official.personnel, rank: null } },
    { ...official, personnel: { ...official.personnel, service_number: '' } },
  ])('rejects missing official credentials %j', async (profile) => {
    mocks.body.mockResolvedValue(feedbackBody)
    const database = createSupabaseMock([{ data: { id: 'person-1' }, error: null }, { data: profile, error: null }])
    mocks.client.mockReturnValue(database.client)
    await expect(feedbackCreate(createTestEvent('/api/personnel/person-1/performance-feedback', 'POST'))).rejects.toMatchObject({ statusCode: 403 })
    expect(database.calls.some((call) => call.method === 'insert')).toBe(false)
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ outcome: 'failed', statusCode: 403 }))
  })

  it('audits a rejected database officiation', async () => {
    mocks.body.mockResolvedValue(feedbackBody)
    const database = createSupabaseMock([
      { data: { id: 'person-1' }, error: null }, { data: official, error: null },
      { data: null, error: { message: 'Officiation rejected' } },
    ])
    mocks.client.mockReturnValue(database.client)
    await expect(feedbackCreate(createTestEvent('/api/personnel/person-1/performance-feedback', 'POST'))).rejects.toThrow('Officiation rejected')
    expect(mocks.audit).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ outcome: 'failed', statusCode: 500 }))
  })
})
