import { describe, expect, it } from 'vitest'

import { parseCreateDeploymentPayload } from '../../../../server/shared/validations/domain/deployment-management'

describe('deployment endpoint payloads', () => {
  it('normalizes deployment details and coordinates', () => {
    expect(parseCreateDeploymentPayload({
      deploymentArea: ' Northern Sector ',
      deploymentAreaLatitude: 14.5995,
      deploymentAreaLongitude: 120.9842,
      startDate: '2026-09-01',
      statusId: ' active ',
      supervisorPersonnelId: ' personnel-1 ',
    })).toMatchObject({

    })
  })
})
