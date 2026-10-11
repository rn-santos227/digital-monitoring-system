import { afterEach, describe, expect, it, vi } from 'vitest'

import { normalizeDateFormat } from '@/app/utils/date-format'
import { generateUserPassword } from '@/app/utils/password-generator'
import { resolveGeoMapSettings } from '@/app/utils/geomap-settings'
import { settingsFixture } from '@/tests/helpers/settings-fixture'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('date format aliases', () => {
  it.each([
    { input: null, expected: 'yyyy-MM-dd' },
    { input: undefined, expected: 'yyyy-MM-dd' },
    { input: ' ', expected: 'yyyy-MM-dd' },
    { input: 'unknown', expected: 'yyyy-MM-dd' },
    { input: ' MM/DD/YYYY ', expected: 'MM/dd/yyyy' },
    { input: 'DD/MM/YYYY', expected: 'dd/MM/yyyy' },
    { input: 'DD-MM-YYYY', expected: 'dd-MM-yyyy' },
    { input: 'MM/dd/yyyy', expected: 'MM/dd/yyyy' },
  ])('normalizes $input', ({ input, expected }) => {
    expect(normalizeDateFormat(input)).toBe(expected)
  })
})

describe('password generation', () => {
  it.each([undefined, 0, 7, 8.5, Number.NaN])(
    'uses the default length for %s',
    (length) => {
      expect(generateUserPassword(length)).toHaveLength(14)
    },
  )

  it('supports requested lengths using crypto and a deterministic fallback', () => {
    const getRandomValues = vi.fn((buffer: Uint32Array) => {
      buffer[0] = 0
      return buffer
    })
    vi.stubGlobal('crypto', { getRandomValues })
    expect(generateUserPassword(8)).toBe('AAAAAAAA')
    expect(getRandomValues).toHaveBeenCalledTimes(8)
    vi.stubGlobal('crypto', undefined)
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(generateUserPassword(20)).toBe('A'.repeat(20))
  })
})

describe('map settings', () => {
  it('parses coordinates and clamps zoom levels', () => {
    expect(
      resolveGeoMapSettings({
        ...settingsFixture,
        mapDefaultLatitude: '14.6',
        mapDefaultLongitude: '121',
        mapMinZoom: -5,
        mapMaxZoom: 30,
        mapDefaultZoom: 40,
      }),
    ).toEqual({
      defaultLatitude: 14.6,
      defaultLongitude: 121,
      minZoom: 1,
      maxZoom: 22,
      defaultZoom: 22,
    })
  })

  it('omits invalid coordinates and keeps the maximum above the minimum', () => {
    expect(
      resolveGeoMapSettings({
        ...settingsFixture,
        mapDefaultLatitude: 'invalid',
        mapDefaultLongitude: Infinity,
        mapMinZoom: 10,
        mapMaxZoom: 5,
        mapDefaultZoom: 1,
      }),
    ).toEqual({ minZoom: 10, maxZoom: 10, defaultZoom: 10 })
  })
})
