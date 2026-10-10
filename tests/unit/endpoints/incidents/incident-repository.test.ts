import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'incidents',
  table: 'equipment_incidents',
  entity: 'EquipmentIncident',
  payload: {
    equipment_asset_id: 'asset-id',
    incident_type_id: 'type-id',
    incident_date: '2026-10-04',
    description: 'Test Incident',
  },
})

defineRepositoryUpdateTests(
  'incidents',
  'equipment_incidents',
  'EquipmentIncident',
  { resolution: 'Resolved' },
)
