import { describe, expect, it } from 'vitest'

import {
  EQUIPMENT_ASSET_SEARCHABLE_FIELD_COLUMNS,
  EQUIPMENT_CATEGORY_SEARCHABLE_FIELD_COLUMNS,
  EQUIPMENT_ISSUANCE_SEARCHABLE_FIELD_COLUMNS,
  EQUIPMENT_ITEM_SEARCHABLE_FIELD_COLUMNS,
} from '../../../../server/shared/constants'
import { parseEquipmentAdvancedSearchConditions } from '../../../../server/shared/validations'
import { buildPersonnelAdvancedSearchFilters } from '../../../../server/utils/personnel/buildPersonnelAdvancedSearchFilters'

describe('equipment management advanced search filters', () => {
  it('parses and builds equipment item conditions', () => {
    const conditions = parseEquipmentAdvancedSearchConditions(JSON.stringify([
      { field: 'equipmentCode', operator: 'startsWith', value: 'RIFLE' },
      { field: 'manufacturer', operator: 'contains', value: 'Arms' },
    ]))

    expect(buildPersonnelAdvancedSearchFilters(conditions, EQUIPMENT_ITEM_SEARCHABLE_FIELD_COLUMNS)).toEqual([
      {
        column: 'equipment_code',
        operator: 'ilike',
        value: 'RIFLE%',
        conditionGroup: 'condition-0',
      },
      {
        column: 'manufacturer',
        operator: 'ilike',
        value: '%Arms%',
        conditionGroup: 'condition-1',
      },
    ])
  })

  it('builds equipment category timestamp ranges', () => {
    const filters = buildPersonnelAdvancedSearchFilters([{
      field: 'createdAt',
      operator: 'between',
      value: '2026-09-01',
      valueTo: '2026-09-30',
    }], EQUIPMENT_CATEGORY_SEARCHABLE_FIELD_COLUMNS)

    expect(filters.map(filter => [filter.column, filter.operator, filter.value])).toEqual([
      ['created_at', 'gte', '2026-09-01T00:00:00.000Z'],
      ['created_at', 'lte', '2026-09-30T23:59:59.999Z'],
    ])
  })

  it.each([
    ['asset', EQUIPMENT_ASSET_SEARCHABLE_FIELD_COLUMNS],
    ['category', EQUIPMENT_CATEGORY_SEARCHABLE_FIELD_COLUMNS],
    ['item', EQUIPMENT_ITEM_SEARCHABLE_FIELD_COLUMNS],
    ['issuance', EQUIPMENT_ISSUANCE_SEARCHABLE_FIELD_COLUMNS],
  ] as const)('rejects unsupported %s fields', (_domain, searchableFields) => {

  })
})
