import { describe, expect, it } from 'vitest'
import { parsePersonnelHistoryPayload } from '@/server/shared/validation/domain/personnel-history'
import { parsePersonnelFeedbackPayload } from '@/server/shared/validation/domain/personnel-feedback'
import { validatePersonnelHistoryForm } from '@/app/utils/personnel-history'
import { formatPersonnelFeedbackTime } from '@/app/utils/personnel-feedback'

const history = {
  organization: ' Example organization ', description: ' Technician ', educationLevel: ' Diploma ',
  startDate: '2020-01-01', endDate: '2022-01-01', reference: '', remarks: '',
}
const feedback = { feedback: 'Consistently meets operational requirements.', reviewDate: '2026-10-12', rating: 4, attestAuthorship: true }

describe('personnel employment and education validation', () => {
  it('maps employment fields without writing education fields', () => {
    expect(parsePersonnelHistoryPayload(history, 'employment')).toEqual({
      employer_name: 'Example organization', job_title: 'Technician',
      start_date: '2020-01-01', end_date: '2022-01-01', reference: null, remarks: null,
    })
  })

  it('maps school and qualification fields for education', () => {
    expect(parsePersonnelHistoryPayload(history, 'education')).toMatchObject({
      institution_name: 'Example organization', qualification_name: 'Technician', education_level: 'Diploma',
    })
  })

  it.each(['employment', 'education'] as const)('validates required fields and chronology for %s', (kind) => {
    expect(() => parsePersonnelHistoryPayload({ ...history, organization: ' ' }, kind)).toThrow('required')
    expect(() => parsePersonnelHistoryPayload({ ...history, description: '' }, kind)).toThrow('required')
    expect(() => parsePersonnelHistoryPayload({ ...history, endDate: '2019-01-01' }, kind)).toThrow('earlier')
    expect(() => parsePersonnelHistoryPayload({ ...history, startDate: '2026-02-30' }, kind)).toThrow('valid date')
    expect(validatePersonnelHistoryForm({ ...history, endDate: '2019-01-01' }, kind).payload).toBeNull()
  })

  it('allows unknown dates and optional references', () => {
    expect(parsePersonnelHistoryPayload({ organization: 'College', description: 'Degree' }, 'education')).toMatchObject({
      start_date: null, end_date: null, reference: null, remarks: null,
    })
  })
})

describe('officiated feedback payloads', () => {
  it('accepts confirmation without a written signature and discards forged attribution', () => {
    expect(parsePersonnelFeedbackPayload({
      ...feedback, authorUserId: 'someone-else', authorRank: 'General', authorServiceNumber: 'FAKE',
      officiatedAt: '2000-01-01', signature: 'Someone else',
    })).toEqual(feedback)
  })

  it.each([false, undefined, 'true'])('rejects missing authorship confirmation: %s', (attestAuthorship) => {
    expect(() => parsePersonnelFeedbackPayload({ ...feedback, attestAuthorship })).toThrow('authored')
  })

  it.each([0, 6, 1.5, '4', Number.NaN])('rejects invalid ratings: %s', (rating) => {
    expect(() => parsePersonnelFeedbackPayload({ ...feedback, rating })).toThrow()
  })

  it('requires actual feedback and a real review date', () => {
    expect(() => parsePersonnelFeedbackPayload({ ...feedback, feedback: ' ' })).toThrow('required')
    expect(() => parsePersonnelFeedbackPayload({ ...feedback, feedback: 'x'.repeat(6001) })).toThrow('6000')
    expect(() => parsePersonnelFeedbackPayload({ ...feedback, reviewDate: '2026-02-30' })).toThrow('valid review date')
  })

  it('displays officiation timestamps in Manila time', () => {
    expect(formatPersonnelFeedbackTime('2026-10-11T23:30:00Z')).toContain('Oct 12, 2026')
    expect(formatPersonnelFeedbackTime('2026-10-11T23:30:00Z')).toContain('07:30:00')
    expect(formatPersonnelFeedbackTime('invalid')).toBe('—')
  })
})
