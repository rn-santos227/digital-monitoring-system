import { describe, expect, it } from 'vitest'

import { parseBoolean, parseNumber } from '../../../../server/shared/utils/parsers'

describe('system value parsing behavior', () => {
  it.each([
    [' YES ', true],
    ['0', false],
    [true, true],
  ])('parses %j as %j', (input, expected) => {
    expect(parseBoolean(input)).toBe(expected)
  })

  it('uses deterministic fallbacks for unsupported values', () => {
    expect(parseBoolean('unknown', true)).toBe(true)
    expect(parseNumber('not-a-number', 25)).toBe(25)
  })

  it('parses finite numeric input', () => {
    expect(parseNumber('12.5')).toBe(12.5)
  })
})
