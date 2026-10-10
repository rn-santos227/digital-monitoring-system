import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'equipment-issuances',
  table: 'equipment_issuances',
  entity: 'EquipmentIssuance',
  payload: {
    equipment_asset_id: 'asset-id',
    issued_to_personnel_id: 'personnel-id',
    quantity_issued: 1,
  },
})

defineRepositoryUpdateTests(
  'equipment-issuances',
  'equipment_issuances',
  'EquipmentIssuance',
  { actual_return_date: '2026-10-04' },
)
