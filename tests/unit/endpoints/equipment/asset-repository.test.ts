import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'equipment-assets',
  table: 'equipment_assets',
  entity: 'EquipmentAsset',
  payload: {
    asset_tag: 'TAG-1',
    equipment_item_id: 'item-id',
    asset_status_id: 'status-id',
  },
})

defineRepositoryUpdateTests(
  'equipment-assets',
  'equipment_assets',
  'EquipmentAsset',
  { current_location: 'Test Location' },
)
