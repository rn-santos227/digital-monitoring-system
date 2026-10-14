import { describe, expect, it } from 'vitest'

import { parseDeploymentSuggestionQuery } from '@/server/shared/utils/deployment-management'
import { parseEngagementSuggestionQuery } from '@/server/shared/utils/engagement-management'
import {
  parseEquipmentCategorySuggestionQuery,
  parseEquipmentItemSuggestionQuery,
} from '@/server/shared/utils/equipment-management'
import { parsePersonnelSuggestionQuery } from '@/server/shared/utils/personnel-management'
import { parseRankSuggestionQuery } from '@/server/shared/utils/rank-management'
import { parseTrainingSuggestionQuery } from '@/server/shared/utils/training-management'
import { parseUnitSuggestionQuery } from '@/server/shared/utils/unit-management'
import { parseManagementPaginationQuery } from '@/server/shared/utils/user-management'
import { parsePaginationQuery } from '@/server/shared/utils/audit'

describe.each([
  ['deployment', parseDeploymentSuggestionQuery],
  ['engagement', parseEngagementSuggestionQuery],
  ['equipment category', parseEquipmentCategorySuggestionQuery],
  ['equipment item', parseEquipmentItemSuggestionQuery],
  ['rank', parseRankSuggestionQuery],
  ['training', parseTrainingSuggestionQuery],
  ['unit', parseUnitSuggestionQuery],
] as const)('%s suggestion limits', (_name, parse) => {
  it('uses safe defaults for missing and malformed inputs', () => {
    expect(parse({})).toMatchObject({
      term: '',
      selectedId: null,
      pageSize: 10,
    })
    expect(
      parse({ term: 1, selectedId: 1, pageSize: 'invalid' }),
    ).toMatchObject({ term: '', selectedId: null, pageSize: 10 })
  })

  it('trims terms, preserves selected ids, and bounds page size', () => {
    expect(
      parse({ term: ' Test ', selectedId: 'selected', pageSize: 1e6 }),
    ).toMatchObject({ term: 'Test', selectedId: 'selected', pageSize: 20 })
    expect(parse({ selectedId: '', pageSize: -1 }).pageSize).toBe(1)
    expect(parse({ pageSize: '2.9' }).pageSize).toBe(2)
  })
})

describe('personnel suggestion scope', () => {
  it('normalizes all optional selection and exclusion ids', () => {
    expect(
      parsePersonnelSuggestionQuery({
        term: ' Officer ',
        pageSize: 99,
        selectedPersonnelId: 'person',
        excludeCompanyId: 'company',
        excludeBattalionId: 'battalion',
      }),
    ).toEqual({
      term: 'Officer',
      pageSize: 20,
      selectedPersonnelId: 'person',
      excludeCompanyId: 'company',
      excludeBattalionId: 'battalion',
    })
    expect(
      parsePersonnelSuggestionQuery({
        term: false,
        pageSize: -2,
        selectedPersonnelId: 1,
        excludeCompanyId: '',
        excludeBattalionId: false,
      }),
    ).toEqual({
      term: '',
      pageSize: 1,
      selectedPersonnelId: null,
      excludeCompanyId: null,
      excludeBattalionId: null,
    })
    expect(
      parseUnitSuggestionQuery({ battalionId: 'battalion' }).battalionId,
    ).toBe('battalion')
    expect(parseUnitSuggestionQuery({ battalionId: 1 }).battalionId).toBeNull()
  })
})

describe.each([
  ['management', parseManagementPaginationQuery],
  ['audit', parsePaginationQuery],
] as const)('%s pagination', (_name, parse) => {
  it('computes inclusive database ranges and clamps invalid limits', () => {
    expect(parse({ page: '3', pageSize: '5' })).toEqual({
      page: 3,
      pageSize: 5,
      rangeFrom: 10,
      rangeTo: 14,
    })
    expect(parse({ page: -3, pageSize: -1 })).toEqual({
      page: 1,
      pageSize: 1,
      rangeFrom: 0,
      rangeTo: 0,
    })
    const bounded = parse({ pageSize: 1e6 })
    expect(bounded.pageSize).toBeLessThan(1e6)
    expect(bounded.rangeTo).toBe(bounded.pageSize - 1)
  })
})
