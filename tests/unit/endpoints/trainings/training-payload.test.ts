import { describe, expect, it } from 'vitest'

import {
  parseCreateTrainingPayload,
  parseCreateTrainingRecordPayload,
} from '../../../../server/shared/validations/domain/training-management'

describe('training endpoint payloads', () => {
  it('normalizes a training and its optional relationships', () => {
    expect(parseCreateTrainingPayload({

    })).toMatchObject({

    })
  })
})
