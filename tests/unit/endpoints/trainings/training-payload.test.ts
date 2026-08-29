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

    })
  })
})
