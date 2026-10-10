import { describe, expect, it } from 'vitest'
import {
  parseCreateTrainingPayload,
  parseCreateTrainingRecordPayload,
} from '../../../../server/shared/validation/domain/training-management'

describe('training endpoint payloads', () => {
  it('normalizes a training and its optional relationships', () => {
    expect(
      parseCreateTrainingPayload({
        trainingTitle: ' Field Readiness ',
        trainingCategoryId: ' category-1 ',
        startDate: '2026-09-01',
        endDate: '2026-09-03',
        statusId: ' scheduled ',
      }),
    ).toMatchObject({
      training_title: 'Field Readiness',
      training_category_id: 'category-1',
      start_date: '2026-09-01',
      end_date: '2026-09-03',
      status_id: 'scheduled',
    })
  })

  it('rejects a training that ends before it starts', () => {
    expect(() =>
      parseCreateTrainingPayload({
        trainingTitle: 'Field Readiness',
        startDate: '2026-09-03',
        endDate: '2026-09-01',
        statusId: 'scheduled',
      }),
    ).toThrow('End date must be on or after start date.')
  })

  it('builds a personnel training record payload', () => {
    expect(
      parseCreateTrainingRecordPayload({
        trainingId: ' training-1 ',
        personnelId: ' personnel-1 ',
        certificateNo: ' CERT-001 ',
        validUntil: '2027-09-01',
      }),
    ).toEqual({
      training_id: 'training-1',
      personnel_id: 'personnel-1',
      certificate_no: 'CERT-001',
      valid_until: '2027-09-01',
      remarks: null,
    })
  })
})
