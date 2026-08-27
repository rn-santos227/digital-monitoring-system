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

})
