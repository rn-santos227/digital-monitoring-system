import { describe, expect, it } from 'vitest'

import {
  buildGlobalSearchOrFilter,
  calculateGlobalSearchSuggestionScore,
  escapeGlobalSearchTerm,
  joinGlobalSearchParts,
  mapGlobalSearchEquipmentAssetSuggestion,
  mapGlobalSearchIncidentSuggestion,
  mapGlobalSearchPersonnelSuggestion,
  normalizeGlobalSearchText,
  rankGlobalSearchSuggestions,
  toSingleGlobalSearchReference,
  userHasGlobalSearchPermission,
} from '@/server/shared/utils/global-search'
import { parseGlobalSearchSuggestionQuery as parseGlobalSearchQuery } from '@/server/shared/validation/domain/global-search'

describe('global search normalization and ranking', () => {
  it('normalizes terms, joins nonempty labels, and handles optional relations', () => {
    expect(normalizeGlobalSearchText(' Sergeant ')).toBe('sergeant')
    expect(joinGlobalSearchParts([' A ', null, undefined, ' ', 'B'])).toBe(
      'A • B',
    )
    expect(
      toSingleGlobalSearchReference([{ id: 'first' }, { id: 'second' }]),
    ).toEqual({ id: 'first' })
    expect(toSingleGlobalSearchReference([])).toBeNull()
    expect(toSingleGlobalSearchReference(null)).toBeNull()
    expect(
      userHasGlobalSearchPermission(
        { permission_codes: ['personnel.view'] },
        'personnel.view',
      ),
    ).toBe(true)
    expect(
      userHasGlobalSearchPermission({ permission_codes: [] }, 'personnel.view'),
    ).toBe(false)
  })

  it('prioritizes exact matches over prefixes, contained text, and unmatched values', () => {
    const exact = calculateGlobalSearchSuggestionScore('radio', ['radio'])
    const prefix = calculateGlobalSearchSuggestionScore('radio', [
      'radio operator',
    ])
    const contained = calculateGlobalSearchSuggestionScore('radio', [
      'portable radio',
    ])
    expect(exact).toBeGreaterThan(prefix)
    expect(prefix).toBeGreaterThan(contained)
    expect(contained).toBeGreaterThan(0)
    expect(
      calculateGlobalSearchSuggestionScore('radio', [null, 'personnel']),
    ).toBe(0)
  })

  it('escapes database wildcard and separator characters', () => {
    expect(escapeGlobalSearchTerm('a%_,')).toBe('a\\%\\_\\,')
    expect(buildGlobalSearchOrFilter('a%', ['name', 'code'])).toBe(
      'name.ilike.%a\\%%,code.ilike.%a\\%%',
    )
  })

  it('parses required search terms and rejects empty or non-string requests', () => {
    expect(parseGlobalSearchQuery({ term: ' Radio ' }).term).toBe('Radio')
    expect(() => parseGlobalSearchQuery({})).toThrow(
      expect.objectContaining({ statusCode: 400 }),
    )
    expect(() => parseGlobalSearchQuery({ term: 1 })).toThrow(
      expect.objectContaining({ statusCode: 400 }),
    )
  })
})

describe('domain search suggestions', () => {
  it('maps personnel, equipment, and incidents to their detail routes', () => {
    const personnel = mapGlobalSearchPersonnelSuggestion('SN-01', {
      id: 'person',
      personnel_code: 'P-01',
      service_number: 'SN-01',
      full_name: 'Jane Doe',
      email: 'unit@example.test',
      rank_name: 'Sergeant',
      company_name: null,
      battalion_name: null,
      service_status: 'Active Duty',
    })
    expect(personnel).toMatchObject({
      title: 'Jane Doe',
      domain: 'personnel',
      redirectTo: '/personnel/person',
    })
    const asset = mapGlobalSearchEquipmentAssetSuggestion('Radio', {
      id: 'asset',
      asset_tag: 'AS-01',
      serial_no: null,
      batch_no: null,
      current_location: 'HQ',
      remarks: null,
      equipment_item: [{ equipment_code: 'EQ-01', name: 'Radio' }],
    })
    expect(asset).toMatchObject({
      title: 'AS-01',
      domain: 'equipment',
      redirectTo: '/equipment-assets/asset',
    })
    const incident = mapGlobalSearchIncidentSuggestion('Damage', {
      id: 'incident',
      incident_no: 'IN-01',
      incident_date: '2026-10-04',
      location: null,
      description: 'Damage',
      resolution: null,
      remarks: null,
      incident_type: { name: 'Damage' },
      equipment_asset: [
        {
          asset_tag: 'AS-01',
          equipment_item: [{ equipment_code: 'EQ-01', name: 'Radio' }],
        },
      ],
    })
    expect(incident).toMatchObject({
      title: 'IN-01',
      domain: 'incident',
      redirectTo: '/incidents/incident',
    })
    expect(
      rankGlobalSearchSuggestions([
        [{ ...personnel, score: 1, title: 'Zulu' }],
        [
          { ...asset, score: 1, title: 'Alpha' },
          { ...incident, score: 0 },
        ],
      ]).map((item) => item.title),
    ).toEqual(['Alpha', 'Zulu'])
  })
})
