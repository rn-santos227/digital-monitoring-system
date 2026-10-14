import { describe, expect, it } from 'vitest'
import { createSupabaseMock } from '@/tests/helpers/supabase'
import { assertPersonnelSkillTraining } from '@/server/utils/personnel-skills/assertPersonnelSkillTraining'
import { fetchPersonnelSkills } from '@/server/utils/personnel-skills/fetchPersonnelSkills'
import { getPersonnelSkillById } from '@/server/utils/personnel-skills/getPersonnelSkillById'
import { updatePersonnelSkill } from '@/server/utils/personnel-skills/updatePersonnelSkill'
import { deletePersonnelSkill } from '@/server/utils/personnel-skills/deletePersonnelSkill'
import { fetchPersonnelSkillTrainingOptions } from '@/server/utils/personnel-skills/fetchPersonnelSkillTrainingOptions'
import { assertTrainingRecordHasNoSkills } from '@/server/utils/training-records/assertTrainingRecordHasNoSkills'
import { getBulkDomainDefinition } from '@/server/shared/utils/bulk-management'

describe('personnel skill ownership and evidence safety', () => {
  it('rejects another person’s supporting training', async () => {
    const database = createSupabaseMock([{ data: null, error: null }])
    await expect(assertPersonnelSkillTraining(database.client, 'person-1', 'training-1')).rejects.toMatchObject({ statusCode: 400 })
    expect(database.calls).toContainEqual({ table: 'training_records', method: 'eq', args: ['personnel_id', 'person-1'] })
    expect(database.calls).toContainEqual({ table: 'training_records', method: 'eq', args: ['id', 'training-1'] })
  })

  it('does not require an internal training query for an external skill', async () => {
    const database = createSupabaseMock()
    await assertPersonnelSkillTraining(database.client, 'person-1', null)
    expect(database.from).not.toHaveBeenCalled()
  })

  it('scopes paginated skill reads to the requested personnel', async () => {
    const database = createSupabaseMock([{ data: [], error: null, count: 31 }])
    expect(await fetchPersonnelSkills(database.client, 'person-1', 10, 19)).toEqual({ items: [], totalItems: 31 })
    expect(database.calls).toContainEqual({ table: 'personnel_qualifications', method: 'eq', args: ['personnel_id', 'person-1'] })
    expect(database.calls).toContainEqual({ table: 'personnel_qualifications', method: 'range', args: [10, 19] })
  })

  it.each(['read', 'update', 'delete'])('rejects %s of a skill outside the personnel scope', async (action) => {
    const database = createSupabaseMock([{ data: null, error: null }])
    const payload = {
      qualification_type: 'First aid', skill_source: 'external' as const,
      external_reference: 'CERT-1', training_record_id: null, date_obtained: null, valid_until: null,
    }
    const operation = action === 'read'
      ? getPersonnelSkillById(database.client, 'person-1', 'skill-other')
      : action === 'update'
        ? updatePersonnelSkill(database.client, 'person-1', 'skill-other', payload)
        : deletePersonnelSkill(database.client, 'person-1', 'skill-other')
    await expect(operation).rejects.toMatchObject({ statusCode: 404 })
    expect(database.calls).toContainEqual({ table: 'personnel_qualifications', method: 'eq', args: ['personnel_id', 'person-1'] })
    expect(database.calls).toContainEqual({ table: 'personnel_qualifications', method: 'eq', args: ['id', 'skill-other'] })
  })

  it('keeps a selected training available beyond the first set of title matches', async () => {
    const selected = { id: 'training-2', personnel_id: 'person-1', training_title: 'Navigation' }
    const database = createSupabaseMock([
      { data: [], error: null }, { data: selected, error: null },
    ])
    expect(await fetchPersonnelSkillTrainingOptions(database.client, 'person-1', 'Navigation', 'training-2')).toEqual([selected])
    expect(database.calls.filter((call) => call.method === 'eq' && call.args[0] === 'personnel_id')).toHaveLength(2)
  })

  it('blocks deletion of a training record that supports a skill', async () => {
    const database = createSupabaseMock([{ data: null, error: null, count: 1 }])
    await expect(assertTrainingRecordHasNoSkills(database.client, 'training-1')).rejects.toMatchObject({ statusCode: 409 })
    expect(getBulkDomainDefinition('training-records')?.deleteReferences).toContainEqual({
      table: 'personnel_qualifications', column: 'training_record_id',
    })
  })
})
