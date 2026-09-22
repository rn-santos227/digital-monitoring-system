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
    }], EQUIPMENT_CATEGORY_SEARCHABLE_FIELD_COLUMNS)
  })
})
