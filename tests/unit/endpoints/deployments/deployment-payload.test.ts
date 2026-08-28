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
      deployment_area: 'Northern Sector',
      deployment_area_latitude: 14.5995,
      deployment_area_longitude: 120.9842,
      start_date: '2026-09-01',
      status_id: 'active',
      supervisor_id: 'personnel-1',
    })
  })

  it('rejects coordinates outside valid geographic bounds', () => {
    expect(() => parseCreateDeploymentPayload({
      deploymentArea: 'Northern Sector',
      deploymentAreaLatitude: 91,
      startDate: '2026-09-01',
      statusId: 'active',
    })).toThrow('Deployment area latitude must be between -90 and 90.')
  })
})
