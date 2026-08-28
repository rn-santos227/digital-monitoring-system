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
      page_size: 25,
      map_default_latitude: 14.599512,
      map_default_longitude: 120.984212,
      map_default_zoom: 12,
    })
  })

  it('rejects empty updates and invalid page sizes', () => {
    expect(() => parseApplicationSettingsUpdates({})).toThrow('No updates were provided.')
    expect(() => parseApplicationSettingsUpdates({ pageSize: 101 })).toThrow(
      'Page size must be between 1 and 100.',
    )
  })
})
