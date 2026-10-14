import { describe, expect, it } from 'vitest'
import { parsePersonnelSkillPayload } from '@/server/shared/validation/domain/personnel-skills'
import { validatePersonnelSkillForm } from '@/app/utils/personnel-skills'

const trainingId = '22222222-2222-4222-8222-222222222222'
const form = {
  name: 'First aid',
  source: 'external' as const,
  externalReference: 'Red Cross Certificate CERT-123',
  trainingRecordId: '',
  dateObtained: '2026-01-10',
  validUntil: '2027-01-10',
}

describe('personnel skill evidence validation', () => {
  it('accepts an external reference without requiring an internal training', () => {
    expect(parsePersonnelSkillPayload({ ...form, name: ' First aid ', externalReference: ' CERT-123 ' })).toEqual({
      qualification_type: 'First aid', skill_source: 'external', external_reference: 'CERT-123',
      training_record_id: null, date_obtained: '2026-01-10', valid_until: '2027-01-10',
    })
  })

  it('links training evidence and clears any inactive external reference', () => {
    expect(parsePersonnelSkillPayload({ ...form, source: 'training', trainingRecordId: trainingId })).toMatchObject({
      skill_source: 'training', training_record_id: trainingId, external_reference: null,
    })
  })

  it('clears a prior training link when the source changes to external', () => {
    expect(parsePersonnelSkillPayload({ ...form, trainingRecordId: trainingId }).training_record_id).toBeNull()
    expect(validatePersonnelSkillForm({ ...form, trainingRecordId: trainingId }).payload?.trainingRecordId).toBeNull()
  })

  it.each(['', ' ', '\n'])('requires a reference for external skills: %j', (externalReference) => {
    expect(() => parsePersonnelSkillPayload({ ...form, externalReference })).toThrow('external reference is required')
    expect(validatePersonnelSkillForm({ ...form, externalReference }).errors.externalReference).toBeTruthy()
  })

  it.each(['', 'wrong-id'])('requires a valid training reference: %j', (trainingRecordId) => {
    expect(() => parsePersonnelSkillPayload({ ...form, source: 'training', trainingRecordId })).toThrow('training record')
  })

  it.each([null, [], 'skill', {}, { ...form, source: 'unknown' }, { ...form, externalReference: 12 }])('rejects invalid requests %j', (body) => {
    expect(() => parsePersonnelSkillPayload(body)).toThrow()
  })

  it.each(['2026-02-30', '2026-13-01', '2026-2-01', '0000-01-01'])('rejects nonexistent dates: %s', (dateObtained) => {
    expect(() => parsePersonnelSkillPayload({ ...form, dateObtained })).toThrow('valid date')
    expect(validatePersonnelSkillForm({ ...form, dateObtained }).payload).toBeNull()
  })

  it('rejects validity before acquisition and allows omitted dates', () => {
    expect(() => parsePersonnelSkillPayload({ ...form, validUntil: '2025-01-01' })).toThrow('earlier')
    expect(parsePersonnelSkillPayload({ name: 'Navigation', source: 'external', externalReference: 'Certificate 456' })).toMatchObject({
      date_obtained: null, valid_until: null,
    })
  })

  it('bounds skill names and external references', () => {
    expect(() => parsePersonnelSkillPayload({ ...form, name: 'x'.repeat(161) })).toThrow('160')
    expect(() => parsePersonnelSkillPayload({ ...form, externalReference: 'x'.repeat(1001) })).toThrow('1000')
  })
})
