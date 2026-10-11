import { describe, expect, it } from 'vitest'

import type { UpdateApplicationSettingsPayload } from '@/app/types/domain/application-settings'
import { validateApplicationSettingsUpdate } from '@/app/utils/application-settings-validation'
import { settingsFixture } from '@/tests/helpers/settings-fixture'

const payload: UpdateApplicationSettingsPayload = {
  ...settingsFixture,
  mapDefaultLatitude: 14.6,
  mapDefaultLongitude: 121,
}

describe('application settings form validation', () => {
  it('accepts valid defaults', () => {
    expect(validateApplicationSettingsUpdate(payload)).toBeNull()
  })

  it.each([
    'appName',
    'appShortCode',
    'defaultTimezone',
    'defaultLocale',
    'defaultDateFormat',
  ] as const)('requires %s', (field) => {
    expect(
      validateApplicationSettingsUpdate({ ...payload, [field]: ' ' }),
    ).toMatch(/required/)
  })

  it.each([0, 101, 1.5, Number.NaN])(
    'rejects invalid page size %s',
    (pageSize) => {
      expect(
        validateApplicationSettingsUpdate({ ...payload, pageSize }),
      ).toMatch(/Page size/)
    },
  )

  it.each([0, 23, 1.5, Number.POSITIVE_INFINITY])(
    'rejects invalid zoom %s',
    (mapDefaultZoom) => {
      expect(
        validateApplicationSettingsUpdate({ ...payload, mapDefaultZoom }),
      ).toMatch(/zoom/)
    },
  )

  it.each([-91, 91, Number.NaN])(
    'rejects invalid latitude %s',
    (mapDefaultLatitude) => {
      expect(
        validateApplicationSettingsUpdate({ ...payload, mapDefaultLatitude }),
      ).toMatch(/latitude/)
    },
  )

  it.each([-181, 181, Number.POSITIVE_INFINITY])(
    'rejects invalid longitude %s',
    (mapDefaultLongitude) => {
      expect(
        validateApplicationSettingsUpdate({ ...payload, mapDefaultLongitude }),
      ).toMatch(/longitude/)
    },
  )

  it('rejects values outside the time-format and density enums', () => {
    expect(
      validateApplicationSettingsUpdate({
        ...payload,
        defaultTimeFormat:
          'invalid' as UpdateApplicationSettingsPayload['defaultTimeFormat'],
      }),
    ).toMatch(/time format/)
    expect(
      validateApplicationSettingsUpdate({
        ...payload,
        densityMode:
          'invalid' as UpdateApplicationSettingsPayload['densityMode'],
      }),
    ).toMatch(/Density/)
  })
})
