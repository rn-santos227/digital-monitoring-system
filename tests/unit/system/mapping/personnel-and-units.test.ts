import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  mapPersonnelCompactListItem,
  mapPersonnelDetail,
  mapPersonnelListItem,
  mapPersonnelSuggestionItem,
} from '@/server/shared/utils/personnel-management'
import {
  mapBattalionListItem,
  mapBattalionSuggestionItem,
  mapCompanyListItem,
  mapCompanySuggestionItem,
  mapUnitPersonnelListItem,
} from '@/server/shared/utils/unit-management'
import {
  mapRankListItem,
  mapRankSuggestionItem,
} from '@/server/shared/utils/rank-management'
import type { PersonnelProfileDetailRow } from '@/server/shared/models'

const personnel: PersonnelProfileDetailRow = {
  id: 'person',
  personnel_code: 'P-01',
  service_number: 'SN-01',
  email: 'unit@example.test',
  full_name: 'Jane Doe',
  first_name: 'Jane',
  last_name: 'Doe',
  middle_name: null,
  sex: 'Female',
  rank_id: 'rank',
  rank_code: 'SGT',
  rank_name: 'Sergeant',
  company_id: null,
  company_code: null,
  company_name: null,
  battalion_id: null,
  battalion_code: null,
  battalion_name: null,
  employment_status_id: 'employment',
  employment_status: 'Regular',
  service_status_id: 'service',
  service_status: 'Active Duty',
  contact_number: null,
  position: null,
  birthdate: '2000-10-05',
  date_enlisted: null,
  created_at: 'created',
  updated_at: 'updated',
}
afterEach(() => vi.useRealTimers())

describe('personnel response mapping', () => {
  it('maps detail, compact, list, suggestion, and unit personnel contracts', () => {
    expect(
      mapPersonnelCompactListItem({ ...personnel, full_name: 'Jane Doe' }),
    ).toMatchObject({ fullName: 'Jane Doe', email: 'unit@example.test' })
    expect(
      mapPersonnelListItem({ ...personnel, full_name: 'Jane Doe' }),
    ).toMatchObject({
      personnelCode: 'P-01',
      employmentStatus: 'Regular',
      sex: 'Female',
    })
    expect(
      mapPersonnelSuggestionItem(
        { ...personnel, full_name: 'Jane Doe' },
        'suggested@example.test',
      ),
    ).toMatchObject({ suggestedEmail: 'suggested@example.test' })
    expect(
      mapUnitPersonnelListItem({ ...personnel, full_name: 'Jane Doe' }),
    ).toMatchObject({ serviceNumber: 'SN-01', fullName: 'Jane Doe' })
  })

  it('calculates age before and after a birthday and leaves missing birthdates null', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-04T12:00:00Z'))
    expect(mapPersonnelDetail(personnel).age).toBe(25)
    expect(
      mapPersonnelDetail({ ...personnel, birthdate: '2000-10-04' }).age,
    ).toBe(26)
    expect(mapPersonnelDetail({ ...personnel, birthdate: null }).age).toBeNull()
    expect(
      mapPersonnelDetail({ ...personnel, birthdate: '2030-10-04' }).age,
    ).toBe(0)
  })
})

describe('unit and rank mapping', () => {
  const battalion = {
    id: 'battalion',
    code: 'B-01',
    name: 'Battalion',
    is_active: true,
    created_at: 'created',
    updated_at: 'updated',
  }

  it('handles absent company counts and preserves rank order', () => {
    expect(mapBattalionListItem(battalion).companyCount).toBe(0)
    expect(
      mapBattalionListItem({ ...battalion, companies: [{ count: 2 }] })
        .companyCount,
    ).toBe(2)
    expect(mapBattalionSuggestionItem(battalion)).toEqual({
      id: 'battalion',
      code: 'B-01',
      name: 'Battalion',
      isActive: true,
    })
    const rank = {
      id: 'rank',
      code: 'SGT',
      name: 'Sergeant',
      sort_order: 0,
      created_at: 'created',
      updated_at: 'updated',
    }
    expect(mapRankListItem(rank)).toMatchObject({
      sortOrder: 0,
      createdAt: 'created',
    })
    expect(mapRankSuggestionItem(rank)).toEqual({
      id: 'rank',
      code: 'SGT',
      name: 'Sergeant',
      sortOrder: 0,
    })
  })

  it.each(['object', 'array', 'empty', 'null'] as const)(
    'normalizes %s company battalion references',
    (kind) => {
      const relation =
        kind === 'object'
          ? battalion
          : kind === 'array'
            ? [battalion]
            : kind === 'empty'
              ? []
              : null
      const row = {
        ...battalion,
        id: 'company',
        battalion_id: 'battalion',
        battalion: relation,
      }
      const expectedName =
        kind === 'object' || kind === 'array' ? 'Battalion' : null
      expect(mapCompanyListItem(row).battalionName).toBe(expectedName)
      expect(mapCompanySuggestionItem(row).battalionName).toBe(expectedName)
    },
  )
})
