import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'equipment-items',
  table: 'equipment_items',
  entity: 'EquipmentItem',
  payload: {
    equipment_code: 'RADIO-1',
    name: 'Test Radio',
    category_id: 'category-id',
    is_active: true,
  },
})

defineRepositoryUpdateTests(
  'equipment-items',
  'equipment_items',
  'EquipmentItem',
  { minimum_stock_level: 2 },
)
