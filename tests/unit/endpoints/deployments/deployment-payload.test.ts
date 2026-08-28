import { describe, expect, it } from 'vitest'

import { parseCreateDeploymentPayload } from '../../../../server/shared/validations/domain/deployment-management'

describe('deployment endpoint payloads', () => {
  it('normalizes deployment details and coordinates', () => {
    expect(parseCreateDeploymentPayload({

    })).toMatchObject({

    })
  })
})
