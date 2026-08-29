import { describe, expect, it } from 'vitest'

import {
  parseCreateTrainingPayload,
  parseCreateTrainingRecordPayload,
} from '../../../../server/shared/validations/domain/training-management'

describe('training endpoint payloads', () => {
  it('normalizes a training and its optional relationships', () => {
    expect(parseCreateTrainingPayload({
      trainingTitle: ' Field Readiness ',
      trainingCategoryId: ' category-1 ',
      startDate: '2026-09-01',
      endDate: '2026-09-03',
      statusId: ' scheduled ',
    })).toMatchObject({
      training_title: 'Field Readiness',
      training_category_id: 'category-1',
      start_date: '2026-09-01',
      end_date: '2026-09-03',
      status_id: 'scheduled',
    })
  })
})
