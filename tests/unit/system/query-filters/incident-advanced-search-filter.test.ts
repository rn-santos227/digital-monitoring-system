import { describe, expect, it } from 'vitest'
import { EQUIPMENT_INCIDENT_SEARCHABLE_FIELD_COLUMNS } from '../../../../server/shared/constants'
import { parseEquipmentIncidentAdvancedSearchConditions } from '../../../../server/shared/validations'
import { buildPersonnelAdvancedSearchFilters } from '../../../../server/utils/personnel/buildPersonnelAdvancedSearchFilters'

describe('equipment incident advanced search filters', () => {
  it('parses and builds incident text conditions', () => {
    const conditions = parseEquipmentIncidentAdvancedSearchConditions(JSON.stringify([
      { field: 'incidentNo', operator: 'startsWith', value: 'INC-' },
      { field: 'location', operator: 'contains', value: 'Camp' },
    ]))

    expect(buildPersonnelAdvancedSearchFilters(
      conditions,
      EQUIPMENT_INCIDENT_SEARCHABLE_FIELD_COLUMNS,
    )).toEqual([
      {
        column: 'incident_no',
        operator: 'ilike',

      }
    ])
  })
})
