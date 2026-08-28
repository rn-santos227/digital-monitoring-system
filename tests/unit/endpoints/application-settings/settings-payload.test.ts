import { describe, expect, it } from 'vitest'

import { parseApplicationSettingsUpdates } from '../../../../server/shared/validations/domain/application-settings'

describe('application settings endpoint payloads', () => {
  it('normalizes pagination and map settings', () => {
    expect(parseApplicationSettingsUpdates({
      pageSize: 25.8,
      mapDefaultLatitude: 14.59951234,
      mapDefaultLongitude: 120.98421234,
      mapDefaultZoom: 12.9,
    })).toEqual({

    })
  })
})
