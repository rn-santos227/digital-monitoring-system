import { describe, expect, it } from 'vitest'
import type { PersonnelSkillRow } from '@/server/shared/models'
import { mapPersonnelSkill } from '@/server/shared/utils/personnel-skills'
import { mapPersonnelSkillTableRow, toPersonnelSkillForm } from '@/app/utils/personnel-skills'

const row: PersonnelSkillRow = {
  id: 'skill-1', personnel_id: 'person-1', qualification_type: 'First aid',
  date_obtained: null, valid_until: null, skill_source: 'training', training_record_id: 'training-1',
  external_reference: null, created_at: 'created', updated_at: 'updated',
  training_record: [{
    id: 'training-1', personnel_id: 'person-1', record_no: 'TR-1', training_title: 'First aid training',
    certificate_no: 'CERT-1', training_status: [{ name: 'Completed' }],
  }],
}

describe('personnel skill display', () => {
  it('shows supporting training, certificate, and status', () => {
    const item = mapPersonnelSkill(row)
    expect(item).toMatchObject({ trainingTitle: 'First aid training', trainingStatus: 'Completed', certificateNo: 'CERT-1' })
    expect(mapPersonnelSkillTableRow(item).evidence).toBe('First aid training · TR-1 · Completed · CERT-1')
  })

  it('preserves legacy qualifications and asks for evidence when editing', () => {
    const item = mapPersonnelSkill({ ...row, skill_source: null, training_record_id: null, training_record: null })
    expect(mapPersonnelSkillTableRow(item).sourceLabel).toBe('Evidence not recorded')
    expect(toPersonnelSkillForm(item)).toMatchObject({ name: 'First aid', source: 'external', externalReference: '' })
  })

  it('shows external references as text', () => {
    const item = mapPersonnelSkill({ ...row, skill_source: 'external', training_record: null, external_reference: 'CERT-OUTSIDE' })
    expect(mapPersonnelSkillTableRow(item).evidence).toBe('CERT-OUTSIDE')
  })
})
