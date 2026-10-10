import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'equipment-categories',
  table: 'equipment_categories',
  entity: 'EquipmentCategory',
  payload: { code: 'RADIO', name: 'Communications', is_active: true },
})

defineRepositoryUpdateTests(
  'equipment-categories',
  'equipment_categories',
  'EquipmentCategory',
  { name: 'Updated Category' },
)
